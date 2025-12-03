import { Router } from 'express'
import { authenticateToken } from '../../middlewares/auth-middleware.js'
import { requireSystemRole, requirePermission } from '../../middlewares/permission-middleware.js'
import { requireBusinessAccess } from '../../middlewares/business-access.js'
import {
  listAllPositions,
  listPositions,
  listUserPositions,
  createPosition,
  editPosition,
  deletePosition,
  getPosition,
  listPositionPermissions,
  addPositionPermission,
  removePositionPermission,
  assignPosition,
  unassignPosition,
  getUserPosition,
  // Permission Overrides (per-business customization)
  listPositionsWithStatus,
  getEffectivePositionPermissions,
  getAvailablePermissions,
  addPermissionOverride,
  removePermissionOverride,
  resetPositionOverrides,
  getPositionOverrides,
} from '../../controllers/business/business-positions-controller.js'

const router = Router()

// All routes require authentication
router.use(authenticateToken)

// ============================================
// POSITION MANAGEMENT (Global - SuperAdmin only)
// ============================================

// List all available positions (global templates) - superadmin only
router.get('/all', requireSystemRole('superadmin'), listAllPositions)

// Get single position by ID - superadmin only  
router.get('/:id', requireSystemRole('superadmin'), getPosition)

// Positions CRUD - superadmin only
router.get('/', requireSystemRole('superadmin'), listPositions)
router.post('/', requireSystemRole('superadmin'), createPosition)
router.put('/:id', requireSystemRole('superadmin'), editPosition)
router.delete('/:id', requireSystemRole('superadmin'), deletePosition)

// ============================================
// POSITION PERMISSIONS - PRESET (SuperAdmin only)
// ============================================

// Position preset permissions mapping - superadmin only
router.get('/:id/permissions', requireSystemRole('superadmin'), listPositionPermissions)
router.post('/:id/permissions', requireSystemRole('superadmin'), addPositionPermission)
router.delete('/:id/permissions/:featureActionId', requireSystemRole('superadmin'), removePositionPermission)

// ============================================
// PERMISSION OVERRIDES (Per-Business Customization)
// Requires role_permission permission within the business
// ============================================

// Get all positions with override status for a business
router.get('/business/:businessId/override-status', 
  requireBusinessAccess, 
  requirePermission('role_permission:read'), 
  listPositionsWithStatus
)

// Get effective permissions (preset + ADD overrides - REMOVE overrides)
router.get('/business/:businessId/positions/:positionId/effective-permissions', 
  requireBusinessAccess, 
  requirePermission('role_permission:read'), 
  getEffectivePositionPermissions
)

// Get available permissions that can be added (not in preset, not already added)
router.get('/business/:businessId/positions/:positionId/available-permissions', 
  requireBusinessAccess, 
  requirePermission('role_permission:read'), 
  getAvailablePermissions
)

// Get current overrides for a position
router.get('/business/:businessId/positions/:positionId/overrides', 
  requireBusinessAccess, 
  requirePermission('role_permission:read'), 
  getPositionOverrides
)

// Add a permission override (ADD or REMOVE)
router.post('/business/:businessId/positions/:positionId/overrides', 
  requireBusinessAccess, 
  requirePermission('role_permission:create'), 
  addPermissionOverride
)

// Remove a specific permission override (restore to preset for that permission)
router.delete('/business/:businessId/positions/:positionId/overrides/:featureActionId', 
  requireBusinessAccess, 
  requirePermission('role_permission:create'), 
  removePermissionOverride
)

// Reset ALL overrides for a position (restore to full preset)
router.delete('/business/:businessId/positions/:positionId/overrides', 
  requireBusinessAccess, 
  requirePermission('role_permission:create'), 
  resetPositionOverrides
)

// ============================================
// BUSINESS-SPECIFIC USER POSITION ASSIGNMENTS
// Requires user_management permission
// ============================================

// List user-position assignments in a business
router.get('/business/:businessId/users', 
  requireBusinessAccess, 
  requirePermission('user_management:read'), 
  listUserPositions
)

// Assign a user to a position in a business
router.post('/business/:businessId/assign', 
  requireBusinessAccess, 
  requirePermission('user_management:update'), 
  assignPosition
)

// Remove a user's position in a business
router.delete('/business/:businessId/assign/:userId', 
  requireBusinessAccess, 
  requirePermission('user_management:update'), 
  unassignPosition
)

// Get a specific user's position in a business
router.get('/business/:businessId/user/:userId', 
  requireBusinessAccess, 
  requirePermission('user_management:read'), 
  getUserPosition
)

export default router
