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
import { listFeatureActions, createFeatureAction, deleteFeatureAction } from '../controllers/rbac/feature-actions-controller.js'
import { listFeatures } from '../controllers/rbac/feature-controller.js'
import { listActions } from '../controllers/rbac/action-controller.js'

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

// Feature actions
router.get('/features', listFeatures)
router.get('/actions', listActions)
router.get('/features/actions', listFeatureActions)
router.post('/features/actions', createFeatureAction)
router.delete('/features/actions/:id', deleteFeatureAction)

export default router
