import { getEffectivePermissions } from '../repositories/permissionRepository.js'

// Checks if the authenticated user has a specific permission.
// Looks at union of system permissions and business position permissions.
export function requirePermission(permissionKey) {
  return async (req, res, next) => {
    try {
      console.log('Checking permission for key:', permissionKey)
      if (!req.user) return res.status(401).json({ error: 'Unauthorized' })
      
        
      // Try to use already attached permissions (e.g., computed at login or previous middleware)
      let permissions = Array.isArray(req.user.permissions) ? req.user.permissions : null

      // Otherwise compute on the fly based on current business context
      if (!permissions) {
        const businessId = req.params.businessId || req.headers['x-business-id'] || req.body?.businessId || null
        permissions = await getEffectivePermissions({
          systemRoleName: req.user.system_role,
          userId: req.user.user_id || req.user.id,
          businessId
        })
      }

      if (Array.isArray(permissions) && permissions.includes(permissionKey)) return next()
      return res.status(403).json({ error: 'Forbidden' })
    } catch (err) {
      console.error('requirePermission error:', err)
      return res.status(500).json({ error: 'Internal server error' })
    }
  }
}

// Simple system role guard
export function requireSystemRole(...allowedRoles) {
  return (req, res, next) => {
    const role = (req.user?.system_role || '').toLowerCase()
    if (allowedRoles.map(r => r.toLowerCase()).includes(role)) return next()
    return res.status(403).json({ error: 'Forbidden' })
  }
}
