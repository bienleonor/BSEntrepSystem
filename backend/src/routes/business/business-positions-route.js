import { Router } from 'express'
import { authenticateToken } from '../../middlewares/auth-middleware.js'
import {
  listPositions,
  createPosition,
  deletePosition,
  listPositionPermissions,
  addPositionPermission,
  removePositionPermission,
  listPositionPresets,
  createPositionPreset,
  deletePositionPreset,
  clonePresetsToBusiness,
} from '../../controllers/business/business-positions-controller.js'

const router = Router()

// Require authentication; ownership is enforced in controller
router.use(authenticateToken)

// Positions CRUD
router.get('/', listPositions)
router.post('/', createPosition)
router.delete('/:id', deletePosition)

// Position permissions mapping
router.get('/:id/permissions', listPositionPermissions)
router.post('/:id/permissions', addPositionPermission)
router.delete('/:id/permissions/:featureActionId', removePositionPermission)

// Global Presets (superadmin only)
router.get('/presets', listPositionPresets)
router.post('/presets', createPositionPreset)
router.delete('/presets/:id', deletePositionPreset)

// Clone presets into the selected business (requires X-Business-ID)
router.post('/clone-presets', clonePresetsToBusiness)

export default router
