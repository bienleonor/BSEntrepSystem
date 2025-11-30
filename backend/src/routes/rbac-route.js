import { Router } from 'express'
import { authenticateToken } from '../middlewares/auth-middleware.js'
import { requireSystemRole } from '../middlewares/permission-middleware.js'
import {
  listSystemRoles,
  createSystemRole,
  deleteSystemRole,
  listPermissionsForRole,
  addPermissionToRole,
  removePermissionFromRole,
} from '../controllers/rbac/roles-controller.js'
import {
  listPermissions,
  createPermission,
  deletePermission,
} from '../controllers/rbac/permissions-controller.js'
import { listAllFeatureActions } from '../repositories/permissionRepository.js'

const router = Router()

// All RBAC management endpoints require authentication and superadmin
router.use(authenticateToken, requireSystemRole('superadmin'))

// Roles
router.get('/roles', listSystemRoles)
router.post('/roles', createSystemRole)
router.delete('/roles/:id', deleteSystemRole)

// Permissions
router.get('/permissions', listPermissions)
router.post('/permissions', createPermission)
router.delete('/permissions/:id', deletePermission)

// Role-Permission mapping
router.get('/roles/:id/permissions', listPermissionsForRole)
router.post('/roles/:id/permissions', addPermissionToRole)
router.delete('/roles/:id/permissions/:permissionId', removePermissionFromRole)

// Feature actions (read-only)
router.get('/features/actions', async (req, res) => {
  try {
    const rows = await listAllFeatureActions()
    res.json(rows)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
})

export default router
