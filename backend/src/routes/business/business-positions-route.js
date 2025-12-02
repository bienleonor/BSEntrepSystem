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
// POSITION PERMISSIONS (SuperAdmin only)
// ============================================

// Position permissions mapping
router.get('/:id/permissions', listPositionPermissions)
router.post('/:id/permissions', addPositionPermission)
router.delete('/:id/permissions/:featureActionId', removePositionPermission)

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
