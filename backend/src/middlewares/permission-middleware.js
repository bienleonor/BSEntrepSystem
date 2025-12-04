import { getCachedPermissions } from '../services/permissionService.js'
import pool from '../config/pool.js'

/**
 * Check if user is the owner of a business
 */
async function isBusinessOwner(userId, businessId) {
  if (!userId || !businessId) return false
  try {
    const [rows] = await pool.execute(
      'SELECT 1 FROM business_table WHERE business_id = ? AND owner_id = ?',
      [businessId, userId]
    )
    return rows.length > 0
  } catch (e) {
    console.error('isBusinessOwner check failed:', e)
    return false
  }
}

/**
 * RBAC Middleware - requirePermission
 * ====================================
 * Checks if the authenticated user has a specific permission.
 * 
 * HOW IT WORKS:
 * 1. Superadmin bypasses all checks (no DB query)
 * 2. Business owners bypass checks for their own business
 * 3. Gets cached permissions (system role + business position + overrides)
 * 4. Checks if permissionKey exists in user's permissions
 * 
 * OVERRIDE FLOW (handled in permissionRepository):
 * - User's position has preset permissions from business_permission_table
 * - Business can ADD extra permissions via override_type='ADD'
 * - Business can REMOVE permissions via override_type='REMOVE'
 * - Final permissions = (Preset - REMOVEs) + ADDs
 */
export function requirePermission(permissionKey) {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
      
      // BYPASS for superadmin - they have access to everything
      const userRole = (req.user.system_role || '').toLowerCase()
      if (userRole === 'superadmin') {
        return next()
      }
      
      // Get business context from multiple sources
      const businessId = req.params.businessId 
        || req.params.business_id 
        || req.headers['x-business-id'] 
        || req.body?.businessId 
        || req.body?.business_id 
        || null
      
      // BYPASS for business owner - they have full access to their own business
      const userId = req.user.user_id || req.user.userId || req.user.id
      if (businessId && await isBusinessOwner(userId, businessId)) {
        return next()
      }
      
      // Get cached permissions (includes overrides automatically)
      const { permissions, isSuperAdmin } = await getCachedPermissions({
        systemRoleName: req.user.system_role,
        userId: userId,
        businessId
      })

      if (isSuperAdmin || permissions.includes(permissionKey)) {
        return next()
      }
      
      return res.status(403).json({ error: 'Forbidden: Missing permission '})
    } catch (err) {
      console.error('requirePermission error:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

/**
 * Simple system role guard
 * Use for superadmin-only or admin-only routes
 */
export function requireSystemRole(...allowedRoles) {
  return (req, res, next) => {
    const role = (req.user?.system_role || '').toLowerCase()
    if (allowedRoles.map(r => r.toLowerCase()).includes(role)) return next()
    return res.status(403).json({ error: 'Forbidden: Requires role ' + allowedRoles.join(' or ') })
  }
}
