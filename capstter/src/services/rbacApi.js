import axiosInstance from '../utils/axiosInstance'

// Placeholder API layer for RBAC management (superadmin only)
// Backend endpoints may need to be implemented; these functions should fail gracefully.

// System Roles
export async function fetchSystemRoles() {
  try {
    const { data } = await axiosInstance.get('/auth/roles')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchSystemRoles error', e)
    return []
  }
}

export async function createSystemRole(role) {
  try {
    const { data } = await axiosInstance.post('/roles', { role })
    return data
  } catch (e) {
    console.warn('createSystemRole error', e)
    return false;
  }
}

export async function deleteSystemRole(roleId) {
  try {
    await axiosInstance.delete(`/roles/${roleId}`)
    return true
  } catch (e) {
    console.warn('deleteSystemRole error', e)
    return false;
  }
}

// Permissions
export async function fetchPermissions() {
  try {
    const { data } = await axiosInstance.get('/permissions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchPermissions error', e)
    return []
  }
}

export async function createPermission(payload) {
  try {
    const { data } = await axiosInstance.post('/permissions', payload)
    return data
  } catch (e) {
    console.warn('createPermission error', e)
    return false;
  }
}

export async function deletePermission(permissionId) {
  try {
    await axiosInstance.delete(`/permissions/${permissionId}`)
    return true
  } catch (e) {
    console.warn('deletePermission error', e)
    return false;
  }
}

// Role-Permission Mapping
export async function fetchRolePermissions(roleId) {
  try {
    const { data } = await axiosInstance.get(`/roles/${roleId}/permissions`)
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchRolePermissions error', e)
    return []
  }
}

export async function addPermissionToRole(roleId, permissionId) {
  try {
    const { data } = await axiosInstance.post(`/roles/${roleId}/permissions`, { permission_id: permissionId })
    return data
  } catch (e) {
    console.warn('addPermissionToRole error', e)
    return false;
  }
}

export async function removePermissionFromRole(roleId, permissionId) {
  try {
    await axiosInstance.delete(`/roles/${roleId}/permissions/${permissionId}`)
    return true
  } catch (e) {
    console.warn('removePermissionFromRole error', e)
    return false;
  }
}

// Feature / Action / Feature-Action combos (business-level)
export async function fetchFeatureActions() {
  try {
    const { data } = await axiosInstance.get('/features/actions')
    return Array.isArray(data) ? data : []
  } catch (e) {
    console.warn('fetchFeatureActions error', e)
    return []
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
}
