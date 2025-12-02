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
import { 
  listFeatureActions, 
  createFeatureAction, 
  deleteFeatureAction 
} from '../controllers/rbac/feature-actions-controller.js'
import { 
  listModules,
  createModule,
  updateModule,
  deleteModule,
  listFeatures,
  listFeaturesGrouped,
  createFeature,
  updateFeature,
  deleteFeature,
} from '../controllers/rbac/feature-controller.js'
import { 
  listActions,
  createAction,
  updateAction,
  deleteAction,
} from '../controllers/rbac/action-controller.js'
import {
  getPositionMatrix,
  getSystemRoleMatrix,
  syncPositionPermissionsHandler,
  bulkAddPositionPermissions,
  bulkDeletePositionPermissions,
  syncSystemRolePermissions,
} from '../controllers/rbac/permission-matrix-controller.js'

const router = Router()

// All RBAC management endpoints require authentication and superadmin
router.use(authenticateToken, requireSystemRole('superadmin'))

// ============================================
// SYSTEM ROLES
// ============================================
router.get('/roles', listSystemRoles)
router.post('/roles', createSystemRole)
router.delete('/roles/:id', deleteSystemRole)

// System Role Permissions
router.get('/roles/:id/permissions', listPermissionsForRole)
router.post('/roles/:id/permissions', addPermissionToRole)
router.delete('/roles/:id/permissions/:permissionId', removePermissionFromRole)

// System Role Permission Matrix
router.get('/roles/:id/matrix', getSystemRoleMatrix)
router.put('/roles/:id/permissions/sync', syncSystemRolePermissions)

// ============================================
// SYSTEM PERMISSIONS
// ============================================
router.get('/permissions', listPermissions)
router.post('/permissions', createPermission)
router.delete('/permissions/:id', deletePermission)

// ============================================
// MODULES
// ============================================
router.get('/modules', listModules)
router.post('/modules', createModule)
router.put('/modules/:id', updateModule)
router.delete('/modules/:id', deleteModule)

// ============================================
// FEATURES
// ============================================
router.get('/features', listFeatures)
router.get('/features/grouped', listFeaturesGrouped)
router.post('/features', createFeature)
router.put('/features/:id', updateFeature)
router.delete('/features/:id', deleteFeature)

// ============================================
// ACTIONS
// ============================================
router.get('/actions', listActions)
router.post('/actions', createAction)
router.put('/actions/:id', updateAction)
router.delete('/actions/:id', deleteAction)

// ============================================
// FEATURE-ACTIONS (Combinations)
// ============================================
router.get('/feature-actions', listFeatureActions)
router.post('/feature-actions', createFeatureAction)
router.delete('/feature-actions/:id', deleteFeatureAction)

// ============================================
// BUSINESS POSITION PERMISSIONS (Matrix)
// ============================================
router.get('/positions/:id/matrix', getPositionMatrix)
router.put('/positions/:id/permissions/sync', syncPositionPermissionsHandler)
router.post('/positions/:id/permissions/bulk', bulkAddPositionPermissions)
router.delete('/positions/:id/permissions/bulk', bulkDeletePositionPermissions)

export default router
