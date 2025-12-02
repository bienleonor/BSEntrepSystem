import axiosInstance from '../utils/axiosInstance'

// ============================================
// SYSTEM ROLES
// ============================================

export async function fetchSystemRoles() {
  try {
    const { data } = await axiosInstance.get('/rbac/roles')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchSystemRoles error', e)
    return []
  }
}

export async function createSystemRole(role) {
  try {
    const { data } = await axiosInstance.post('/rbac/roles', { role })
    return data
  } catch (e) {
    console.warn('createSystemRole error', e)
    throw e
  }
}

export async function deleteSystemRole(roleId) {
  try {
    await axiosInstance.delete(`/rbac/roles/${roleId}`)
    return true
  } catch (e) {
    console.warn('deleteSystemRole error', e)
    throw e
  }
}

// ============================================
// SYSTEM PERMISSIONS
// ============================================

export async function fetchPermissions() {
  try {
    const { data } = await axiosInstance.get('/rbac/permissions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchPermissions error', e)
    return []
  }
}

export async function createPermission(payload) {
  try {
    const { data } = await axiosInstance.post('/rbac/permissions', payload)
    return data
  } catch (e) {
    console.warn('createPermission error', e)
    throw e
  }
}

export async function deletePermission(permissionId) {
  try {
    await axiosInstance.delete(`/rbac/permissions/${permissionId}`)
    return true
  } catch (e) {
    console.warn('deletePermission error', e)
    throw e
  }
}

// ============================================
// ROLE-PERMISSION MAPPING
// ============================================

export async function fetchRolePermissions(roleId) {
  try {
    const { data } = await axiosInstance.get(`/rbac/roles/${roleId}/permissions`)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchRolePermissions error', e)
    return []
  }
}

export async function addPermissionToRole(roleId, permissionId) {
  try {
    const { data } = await axiosInstance.post(`/rbac/roles/${roleId}/permissions`, { permission_id: permissionId })
    return data
  } catch (e) {
    console.warn('addPermissionToRole error', e)
    throw e
  }
}

export async function removePermissionFromRole(roleId, permissionId) {
  try {
    await axiosInstance.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`)
    return true
  } catch (e) {
    console.warn('removePermissionFromRole error', e)
    throw e
  }
}

export async function fetchRolePermissionMatrix(roleId) {
  try {
    const { data } = await axiosInstance.get(`/rbac/roles/${roleId}/matrix`)
    return data
  } catch (e) {
    console.warn('fetchRolePermissionMatrix error', e)
    return null
  }
}

export async function syncRolePermissions(roleId, permissionIds) {
  try {
    const { data } = await axiosInstance.put(`/rbac/roles/${roleId}/permissions/sync`, { permission_ids: permissionIds })
    return data
  } catch (e) {
    console.warn('syncRolePermissions error', e)
    throw e
  }
}

// ============================================
// MODULES
// ============================================

export async function fetchModules() {
  try {
    const { data } = await axiosInstance.get('/rbac/modules')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchModules error', e)
    return []
  }
}

export async function createModule(name) {
  try {
    const { data } = await axiosInstance.post('/rbac/modules', { name })
    return data
  } catch (e) {
    console.warn('createModule error', e)
    throw e
  }
}

export async function updateModule(moduleId, name) {
  try {
    const { data } = await axiosInstance.put(`/rbac/modules/${moduleId}`, { name })
    return data
  } catch (e) {
    console.warn('updateModule error', e)
    throw e
  }
}

export async function deleteModule(moduleId) {
  try {
    await axiosInstance.delete(`/rbac/modules/${moduleId}`)
    return true
  } catch (e) {
    console.warn('deleteModule error', e)
    throw e
  }
}

// ============================================
// FEATURES
// ============================================

export async function fetchFeatures() {
  try {
    const { data } = await axiosInstance.get('/rbac/features')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchFeatures error', e)
    return []
  }
}

export async function fetchFeaturesGrouped() {
  try {
    const { data } = await axiosInstance.get('/rbac/features/grouped')
    return data || {}
  } catch (e) {
    console.warn('fetchFeaturesGrouped error', e)
    return {}
  }
}

export async function createFeature(payload) {
  try {
    const { data } = await axiosInstance.post('/rbac/features', payload)
    return data
  } catch (e) {
    console.warn('createFeature error', e)
    throw e
  }
}

export async function updateFeature(featureId, payload) {
  try {
    const { data } = await axiosInstance.put(`/rbac/features/${featureId}`, payload)
    return data
  } catch (e) {
    console.warn('updateFeature error', e)
    throw e
  }
}

export async function deleteFeature(featureId) {
  try {
    await axiosInstance.delete(`/rbac/features/${featureId}`)
    return true
  } catch (e) {
    console.warn('deleteFeature error', e)
    throw e
  }
}

// ============================================
// ACTIONS
// ============================================

export async function fetchActions() {
  try {
    const { data } = await axiosInstance.get('/rbac/actions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchActions error', e)
    return []
  }
}

export async function createAction(payload) {
  try {
    const { data } = await axiosInstance.post('/rbac/actions', payload)
    return data
  } catch (e) {
    console.warn('createAction error', e)
    throw e
  }
}

export async function updateAction(actionId, payload) {
  try {
    const { data } = await axiosInstance.put(`/rbac/actions/${actionId}`, payload)
    return data
  } catch (e) {
    console.warn('updateAction error', e)
    throw e
  }
}

export async function deleteAction(actionId) {
  try {
    await axiosInstance.delete(`/rbac/actions/${actionId}`)
    return true
  } catch (e) {
    console.warn('deleteAction error', e)
    throw e
  }
}

// ============================================
// FEATURE-ACTIONS (Combinations)
// ============================================

export async function fetchFeatureActions() {
  try {
    const { data } = await axiosInstance.get('/rbac/feature-actions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchFeatureActions error', e)
    return []
  }
}

export async function createFeatureAction(payload) {
  try {
    const { data } = await axiosInstance.post('/rbac/feature-actions', payload)
    return data
  } catch (e) {
    console.warn('createFeatureAction error', e)
    throw e
  }
}

export async function deleteFeatureAction(id) {
  try {
    await axiosInstance.delete(`/rbac/feature-actions/${id}`)
    return true
  } catch (e) {
    console.warn('deleteFeatureAction error', e)
    throw e
  }
}

// ============================================
// BUSINESS POSITIONS (Global Templates)
// ============================================

export async function fetchAllPositions() {
  try {
    const { data } = await axiosInstance.get('/business/positions/all')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchAllPositions error', e)
    return []
  }
}

export async function fetchBusinessPositions(businessId = null) {
  try {
    const config = businessId ? { headers: { 'X-Business-Id': businessId } } : {}
    const { data } = await axiosInstance.get('/business/positions', config)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchBusinessPositions error', e)
    return []
  }
}

export async function fetchPosition(positionId) {
  try {
    const { data } = await axiosInstance.get(`/business/positions/${positionId}`)
    return data
  } catch (e) {
    console.warn('fetchPosition error', e)
    return null
  }
}

export async function createBusinessPosition(payload) {
  try {
    const { data } = await axiosInstance.post('/business/positions', payload)
    return data
  } catch (e) {
    console.warn('createBusinessPosition error', e)
    throw e
  }
}

export async function updateBusinessPosition(positionId, payload) {
  try {
    const { data } = await axiosInstance.put(`/business/positions/${positionId}`, payload)
    return data
  } catch (e) {
    console.warn('updateBusinessPosition error', e)
    throw e
  }
}

export async function deleteBusinessPosition(id) {
  try {
    await axiosInstance.delete(`/business/positions/${id}`)
    return true
  } catch (e) {
    console.warn('deleteBusinessPosition error', e)
    throw e
  }
}

// ============================================
// POSITION PERMISSIONS
// ============================================

export async function fetchPositionPermissions(positionId) {
  try {
    const { data } = await axiosInstance.get(`/business/positions/${positionId}/permissions`)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchPositionPermissions error', e)
    return []
  }
}

export async function addPositionPermission(positionId, featureActionId) {
  try {
    const { data } = await axiosInstance.post(`/business/positions/${positionId}/permissions`, { feature_action_id: featureActionId })
    return data
  } catch (e) {
    console.warn('addPositionPermission error', e)
    throw e
  }
}

export async function removePositionPermission(positionId, featureActionId) {
  try {
    await axiosInstance.delete(`/business/positions/${positionId}/permissions/${featureActionId}`)
    return true
  } catch (e) {
    console.warn('removePositionPermission error', e)
    throw e
  }
}

export async function fetchPositionPermissionMatrix(positionId) {
  try {
    const { data } = await axiosInstance.get(`/rbac/positions/${positionId}/matrix`)
    return data
  } catch (e) {
    console.warn('fetchPositionPermissionMatrix error', e)
    return null
  }
}

export async function syncPositionPermissions(positionId, featureActionIds) {
  try {
    const { data } = await axiosInstance.put(`/rbac/positions/${positionId}/permissions/sync`, { feature_action_ids: featureActionIds })
    return data
  } catch (e) {
    console.warn('syncPositionPermissions error', e)
    throw e
  }
}

export async function bulkAddPositionPermissions(positionId, featureActionIds) {
  try {
    const { data } = await axiosInstance.post(`/rbac/positions/${positionId}/permissions/bulk`, { feature_action_ids: featureActionIds })
    return data
  } catch (e) {
    console.warn('bulkAddPositionPermissions error', e)
    throw e
  }
}

export async function bulkRemovePositionPermissions(positionId, featureActionIds) {
  try {
    const { data } = await axiosInstance.delete(`/rbac/positions/${positionId}/permissions/bulk`, { data: { feature_action_ids: featureActionIds } })
    return data
  } catch (e) {
    console.warn('bulkRemovePositionPermissions error', e)
    throw e
  }
}

// ============================================
// USER POSITION ASSIGNMENTS (Business-specific)
// ============================================

export async function fetchUserPositionsInBusiness(businessId) {
  try {
    const { data } = await axiosInstance.get(`/business/positions/business/${businessId}/users`)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchUserPositionsInBusiness error', e)
    return []
  }
}

export async function assignUserPosition(businessId, userId, positionId) {
  try {
    const { data } = await axiosInstance.post(`/business/positions/business/${businessId}/assign`, { user_id: userId, position_id: positionId })
    return data
  } catch (e) {
    console.warn('assignUserPosition error', e)
    throw e
  }
}

export async function unassignUserPosition(businessId, userId) {
  try {
    await axiosInstance.delete(`/business/positions/business/${businessId}/assign/${userId}`)
    return true
  } catch (e) {
    console.warn('unassignUserPosition error', e)
    throw e
  }
}

export async function fetchUserPositionInBusiness(businessId, userId) {
  try {
    const { data } = await axiosInstance.get(`/business/positions/business/${businessId}/user/${userId}`)
    return data
  } catch (e) {
    console.warn('fetchUserPositionInBusiness error', e)
    return null
  }
}

// ============================================
// EXPORTS
// ============================================

export default {
  // System Roles
  fetchSystemRoles,
  createSystemRole,
  deleteSystemRole,
  
  // System Permissions
  fetchPermissions,
  createPermission,
  deletePermission,
  
  // Role-Permission Mapping
  fetchRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  fetchRolePermissionMatrix,
  syncRolePermissions,
  
  // Modules
  fetchModules,
  createModule,
  updateModule,
  deleteModule,
  
  // Features
  fetchFeatures,
  fetchFeaturesGrouped,
  createFeature,
  updateFeature,
  deleteFeature,
  
  // Actions
  fetchActions,
  createAction,
  updateAction,
  deleteAction,
  
  // Feature-Actions
  fetchFeatureActions,
  createFeatureAction,
  deleteFeatureAction,
  
  // Business Positions
  fetchAllPositions,
  fetchBusinessPositions,
  fetchPosition,
  createBusinessPosition,
  updateBusinessPosition,
  deleteBusinessPosition,
  
  // Position Permissions
  fetchPositionPermissions,
  addPositionPermission,
  removePositionPermission,
  fetchPositionPermissionMatrix,
  syncPositionPermissions,
  bulkAddPositionPermissions,
  bulkRemovePositionPermissions,
  
  // User Position Assignments
  fetchUserPositionsInBusiness,
  assignUserPosition,
  unassignUserPosition,
  fetchUserPositionInBusiness,
}
