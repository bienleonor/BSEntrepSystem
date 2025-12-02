import { Router } from 'express'
import { authenticateToken } from '../../middlewares/auth-middleware.js'
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

// Require authentication; ownership is enforced in controller
router.use(authenticateToken)

// ============================================
// POSITION MANAGEMENT (Global - SuperAdmin)
// ============================================

// List all available positions (global templates)
router.get('/all', listAllPositions)

// Get single position by ID
router.get('/:id', getPosition)

// Positions CRUD (superadmin only for create/update/delete)
router.get('/', listPositions)
router.post('/', createPosition)
router.put('/:id', editPosition)
router.delete('/:id', deletePosition)

// ============================================
// POSITION PERMISSIONS - PRESET (SuperAdmin only)
// ============================================

// Position preset permissions mapping
router.get('/:id/permissions', listPositionPermissions)
router.post('/:id/permissions', addPositionPermission)
router.delete('/:id/permissions/:featureActionId', removePositionPermission)

// ============================================
// PERMISSION OVERRIDES (Per-Business Customization)
// ============================================

// Get all positions with override status for a business
router.get('/business/:businessId/override-status', listPositionsWithStatus)

// Get effective permissions (preset + ADD overrides - REMOVE overrides)
router.get('/business/:businessId/positions/:positionId/effective-permissions', getEffectivePositionPermissions)

// Get available permissions that can be added (not in preset, not already added)
router.get('/business/:businessId/positions/:positionId/available-permissions', getAvailablePermissions)

// Get current overrides for a position
router.get('/business/:businessId/positions/:positionId/overrides', getPositionOverrides)

// Add a permission override (ADD or REMOVE)
router.post('/business/:businessId/positions/:positionId/overrides', addPermissionOverride)

// Remove a specific permission override (restore to preset for that permission)
router.delete('/business/:businessId/positions/:positionId/overrides/:featureActionId', removePermissionOverride)

// Reset ALL overrides for a position (restore to full preset)
router.delete('/business/:businessId/positions/:positionId/overrides', resetPositionOverrides)

// ============================================
// BUSINESS-SPECIFIC USER POSITION ASSIGNMENTS
// ============================================

// These routes require X-Business-Id header or businessId in body/params

// List user-position assignments in a business
router.get('/business/:businessId/users', listUserPositions)

// Assign a user to a position in a business
router.post('/business/:businessId/assign', assignPosition)

// Remove a user's position in a business
router.delete('/business/:businessId/assign/:userId', unassignPosition)

// Get a specific user's position in a business
router.get('/business/:businessId/user/:userId', getUserPosition)

export default router
