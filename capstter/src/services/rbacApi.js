import axiosInstance from '../utils/axiosInstance'

// Placeholder API layer for RBAC management (superadmin only)
// Backend endpoints may need to be implemented; these functions should fail gracefully.

// System Roles
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
    return false;
  }
}

export async function deleteSystemRole(roleId) {
  try {
    await axiosInstance.delete(`/rbac/roles/${roleId}`)
    return true
  } catch (e) {
    console.warn('deleteSystemRole error', e)
    return false;
  }
}

// Permissions
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
    return false;
  }
}

export async function deletePermission(permissionId) {
  try {
    await axiosInstance.delete(`/rbac/permissions/${permissionId}`)
    return true
  } catch (e) {
    console.warn('deletePermission error', e)
    return false;
  }
}

// Role-Permission Mapping
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
    return false;
  }
}

export async function removePermissionFromRole(roleId, permissionId) {
  try {
    await axiosInstance.delete(`/rbac/roles/${roleId}/permissions/${permissionId}`)
    return true
  } catch (e) {
    console.warn('removePermissionFromRole error', e)
    return false;
  }
}

// Feature / Action / Feature-Action combos (business-level)
export async function fetchFeatureActions() {
  try {
    const { data } = await axiosInstance.get('/rbac/features/actions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchFeatureActions error', e)
    return []
  }
}

export async function fetchFeatures() {
  try {
    const { data } = await axiosInstance.get('/rbac/features')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchFeatures error', e)
    return []
  }
}

export async function fetchActions() {
  try {
    const { data } = await axiosInstance.get('/rbac/actions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchActions error', e)
    return []
  }
}

// Feature-Action create/delete (superadmin)
export async function createFeatureAction(payload) {
  try {
    const { data } = await axiosInstance.post('/rbac/features/actions', payload)
    return data
  } catch (e) {
    console.warn('createFeatureAction error', e)
    return false
  }
}

export async function deleteFeatureAction(id) {
  try {
    await axiosInstance.delete(`/rbac/features/actions/${id}`)
    return true
  } catch (e) {
    console.warn('deleteFeatureAction error', e)
    return false
  }
}

// Business Positions
export async function fetchBusinessPositions() {
  try {
    const { data } = await axiosInstance.get('/business/positions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchBusinessPositions error', e)
    return []
  }
}

export async function createBusinessPosition(payload) {
  try {
    const { data } = await axiosInstance.post('/business/positions', payload)
    return data
  } catch (e) {
    console.warn('createBusinessPosition error', e)
    return false
  }
}

export async function deleteBusinessPosition(id) {
  try {
    await axiosInstance.delete(`/business/positions/${id}`)
    return true
  } catch (e) {
    console.warn('deleteBusinessPosition error', e)
    return false
  }
}

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
    return false
  }
}

export async function removePositionPermission(positionId, featureActionId) {
  try {
    await axiosInstance.delete(`/business/positions/${positionId}/permissions/${featureActionId}`)
    return true
  } catch (e) {
    console.warn('removePositionPermission error', e)
    return false
  }
}

export default {
  fetchSystemRoles,
  createSystemRole,
  deleteSystemRole,
  fetchPermissions,
  createPermission,
  deletePermission,
  fetchRolePermissions,
  addPermissionToRole,
  removePermissionFromRole,
  fetchFeatureActions,
  fetchFeatures,
  fetchActions,
  createFeatureAction,
  deleteFeatureAction,
  fetchBusinessPositions,
  createBusinessPosition,
  deleteBusinessPosition,
  fetchPositionPermissions,
  addPositionPermission,
  removePositionPermission,
}
