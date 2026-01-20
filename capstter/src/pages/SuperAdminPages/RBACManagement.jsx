import React, { useEffect, useState } from 'react'
import SuperAdminLayout from '../../components/layout/SuperAdminLayout'
import {
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
  createFeatureAction,
  deleteFeatureAction,
  fetchFeatures,
  fetchActions,
  fetchBusinessPositions,
  createBusinessPosition,
  deleteBusinessPosition,
  fetchPositionPermissions,
  addPositionPermission,
  removePositionPermission,
} from '../../services/rbacApi'
import { toast, ToastContainer } from 'react-toastify'

// Simple tab component
const tabs = [
  { key: 'roles', label: 'System Roles' },
  { key: 'permissions', label: 'System Permissions' },
  { key: 'mapping', label: 'Role ↔ Permissions' },
  { key: 'featureActions', label: 'Feature Actions' },
  { key: 'positions', label: 'Business Positions' },
]

export default function RBACManagement() {
  const [activeTab, setActiveTab] = useState('roles')
  const [loading, setLoading] = useState(false)

  // Roles
  const [roles, setRoles] = useState([])
  const [newRoleName, setNewRoleName] = useState('')

  // Permissions
  const [permissions, setPermissions] = useState([])
  const [newPermissionName, setNewPermissionName] = useState('')
  const [newPermissionDesc, setNewPermissionDesc] = useState('')

  // Mapping
  const [selectedRoleId, setSelectedRoleId] = useState(null)
  const [rolePermissions, setRolePermissions] = useState([])
  const [addPermissionId, setAddPermissionId] = useState('')

  // Feature Actions
  const [featureActions, setFeatureActions] = useState([])
  const [features, setFeatures] = useState([])
  const [actions, setActions] = useState([])
  const [newFeatureId, setNewFeatureId] = useState('')
  const [newActionId, setNewActionId] = useState('')

  // Positions (business layer)
  const [positions, setPositions] = useState([])
  const [newPositionName, setNewPositionName] = useState('')
  const [newPositionDesc, setNewPositionDesc] = useState('')
  const [selectedPositionId, setSelectedPositionId] = useState(null)
  const [positionPermissions, setPositionPermissions] = useState([])
  const [addFeatureActionId, setAddFeatureActionId] = useState('')

  // Generic loader for tabs
  const loadData = async () => {
    setLoading(true)
    try {
      if (activeTab === 'roles') {
        setRoles(await fetchSystemRoles())
      } else if (activeTab === 'permissions') {
        setPermissions(await fetchPermissions())
      } else if (activeTab === 'mapping') {
        setRoles(await fetchSystemRoles())
        setPermissions(await fetchPermissions())
        if (selectedRoleId) {
          setRolePermissions(await fetchRolePermissions(selectedRoleId))
        }
      } else if (activeTab === 'featureActions') {
        setFeatureActions(await fetchFeatureActions())
        setFeatures(await fetchFeatures())
        setActions(await fetchActions())
      } else if (activeTab === 'positions') {
        setPositions(await fetchBusinessPositions())
        setFeatureActions(await fetchFeatureActions())
        if (selectedPositionId) {
          setPositionPermissions(await fetchPositionPermissions(selectedPositionId))
        }
      }
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, selectedRoleId, selectedPositionId])

  // Create role
  const handleCreateRole = async (e) => {
    e.preventDefault()
    if (!newRoleName.trim()) return
    try {
      await createSystemRole(newRoleName.trim())
      toast.success('Role created')
      setNewRoleName('')
      loadData()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to create role')
    }
  }

  const handleDeleteRole = async (roleId) => {
    if (!window.confirm('Delete role?')) return
    try {
      await deleteSystemRole(roleId)
      toast.success('Role deleted')
      if (roleId === selectedRoleId) setSelectedRoleId(null)
      loadData()
    } catch {
      toast.error('Failed to delete role')
    }
  }

  // Create permission
  const handleCreatePermission = async (e) => {
    e.preventDefault()
    if (!newPermissionName.trim()) return
    try {
      await createPermission({
        permission_name: newPermissionName.trim(),
        description: newPermissionDesc.trim(),
      })
      toast.success('Permission created')
      setNewPermissionName('')
      setNewPermissionDesc('')
      loadData()
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to create permission')
    }
  }

  const handleDeletePermission = async (permissionId) => {
    if (!window.confirm('Delete permission?')) return
    try {
      await deletePermission(permissionId)
      toast.success('Permission deleted')
      loadData()
    } catch {
      toast.error('Failed to delete permission')
    }
  }

  // Mapping add/remove
  const handleAddPermissionToRole = async (e) => {
    e.preventDefault()
    if (!selectedRoleId || !addPermissionId) return
    try {
      await addPermissionToRole(selectedRoleId, addPermissionId)
      toast.success('Permission added to role')
      setAddPermissionId('')
      setRolePermissions(await fetchRolePermissions(selectedRoleId))
    } catch {
      toast.error('Failed to add permission')
    }
  }

  const handleRemovePermissionFromRole = async (permId) => {
    if (!selectedRoleId) return
    if (!window.confirm('Remove permission from role?')) return
    try {
      await removePermissionFromRole(selectedRoleId, permId)
      toast.success('Removed')
      setRolePermissions(await fetchRolePermissions(selectedRoleId))
    } catch {
      toast.error('Failed to remove permission')
    }
  }

  const renderRolesTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Roles</h2>
      <form onSubmit={handleCreateRole} className="flex gap-2 mb-4">
        <input
          className="border px-2 py-1 rounded flex-1"
          placeholder="New role name"
          value={newRoleName}
          onChange={e => setNewRoleName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Add</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {roles.map(r => (
            <li key={r.system_role_id} className="flex justify-between items-center border p-2 rounded">
              <span>{r.role}</span>
              <button
                onClick={() => handleDeleteRole(r.system_role_id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >Delete</button>
            </li>
          ))}
          {!roles.length && <li className="text-gray-500">No roles found.</li>}
        </ul>
      )}
    </div>
  )

  const renderPermissionsTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">System Permissions</h2>
      <form onSubmit={handleCreatePermission} className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border px-2 py-1 rounded flex-1 min-w-[200px]"
          placeholder="Permission name"
          value={newPermissionName}
          onChange={e => setNewPermissionName(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded flex-1 min-w-[250px]"
          placeholder="Description"
          value={newPermissionDesc}
          onChange={e => setNewPermissionDesc(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Add</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <ul className="space-y-2">
          {permissions.map(p => (
            <li key={p.system_permission_id} className="flex justify-between items-center border p-2 rounded">
              <div>
                <p className="font-medium">{p.permission_name}</p>
                <p className="text-xs text-gray-600">{p.description}</p>
              </div>
              <button
                onClick={() => handleDeletePermission(p.system_permission_id)}
                className="text-sm bg-red-500 text-white px-2 py-1 rounded"
              >Delete</button>
            </li>
          ))}
          {!permissions.length && <li className="text-gray-500">No permissions found.</li>}
        </ul>
      )}
    </div>
  )

  const renderMappingTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Role ↔ Permissions Mapping</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <h3 className="font-medium mb-2">Select Role</h3>
          <ul className="space-y-2 max-h-64 overflow-auto border rounded p-2">
            {roles.map(r => (
              <li
                key={r.system_role_id}
                onClick={() => setSelectedRoleId(r.system_role_id)}
                className={`p-2 rounded cursor-pointer ${selectedRoleId===r.system_role_id ? 'bg-blue-100 border-blue-400 border' : 'hover:bg-gray-100 border'}`}
              >{r.role}</li>
            ))}
            {!roles.length && <li className="text-gray-500">No roles.</li>}
          </ul>
        </div>
        <div className="md:w-2/3">
          {!selectedRoleId && <p className="text-gray-600">Select a role to view / edit its permissions.</p>}
          {selectedRoleId && (
            <div>
              <h3 className="font-medium mb-3">Assigned Permissions</h3>
              <ul className="space-y-2 max-h-64 overflow-auto border rounded p-2 mb-4">
                {rolePermissions.map(rp => (
                  <li key={rp.system_permission_id} className="flex justify-between items-center p-2 rounded border">
                    <span>{rp.permission_name}</span>
                    <button
                      onClick={() => handleRemovePermissionFromRole(rp.system_permission_id)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >Remove</button>
                  </li>
                ))}
                {(!rolePermissions || !rolePermissions.length) && <li className="text-gray-500">None assigned.</li>}
              </ul>
              <form onSubmit={handleAddPermissionToRole} className="flex gap-2 items-center flex-wrap">
                <select
                  value={addPermissionId}
                  onChange={e => setAddPermissionId(e.target.value)}
                  className="border px-2 py-1 rounded min-w-[200px]"
                >
                  <option value="">Select permission</option>
                  {permissions.map(p => (
                    <option key={p.system_permission_id} value={p.system_permission_id}>{p.permission_name}</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add Permission</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderFeatureActionsTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Feature Actions (Business Layer)</h2>
      <form
        onSubmit={async e => {
          e.preventDefault()
          if (!newFeatureId || !newActionId) return
          const created = await createFeatureAction({ feature_id: Number(newFeatureId), action_id: Number(newActionId) })
          if (created) {
            toast.success('Mapping created')
            setFeatureActions(await fetchFeatureActions())
            setNewFeatureId('')
            setNewActionId('')
          } else {
            toast.error('Failed to create mapping')
          }
        }}
        className="flex flex-wrap gap-2 mb-4 items-center"
      >
        <select
          className="border px-2 py-1 rounded min-w-[180px]"
          value={newFeatureId}
          onChange={e => setNewFeatureId(e.target.value)}
        >
          <option value="">Select Feature</option>
          {features.map(f => <option key={f.feature_id} value={f.feature_id}>{f.feature_name}</option>)}
        </select>
        <select
          className="border px-2 py-1 rounded min-w-[180px]"
          value={newActionId}
          onChange={e => setNewActionId(e.target.value)}
        >
          <option value="">Select Action</option>
          {actions.map(a => <option key={a.action_id} value={a.action_id}>{a.action_name}</option>)}
        </select>
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Create Mapping</button>
      </form>
      {loading ? <p>Loading...</p> : (
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Feature</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">Key</th>
              <th className="p-2 border">Delete</th>
            </tr>
          </thead>
          <tbody>
            {featureActions.map(fa => (
              <tr key={fa.feature_action_id} className="hover:bg-gray-50">
                <td className="p-2 border">{fa.feature_action_id}</td>
                <td className="p-2 border">{fa.feature_name}</td>
                <td className="p-2 border">{fa.action_name}</td>
                <td className="p-2 border font-mono text-xs">{fa.key_name}</td>
                <td className="p-2 border text-center">
                  <button
                    onClick={async () => {
                      if (!window.confirm('Delete mapping?')) return
                      const ok = await deleteFeatureAction(fa.feature_action_id)
                      if (ok) {
                        toast.success('Deleted')
                        setFeatureActions(await fetchFeatureActions())
                      } else {
                        toast.error('Delete failed')
                      }
                    }}
                    className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                  >X</button>
                </td>
              </tr>
            ))}
            {!featureActions.length && (
              <tr><td className="p-2 border text-gray-500" colSpan={4}>No feature actions found.</td></tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  )

  // Positions tab
  const handleCreatePosition = async (e) => {
    e.preventDefault()
    if (!newPositionName.trim()) return
    try {
      await createBusinessPosition({ position_name: newPositionName.trim(), description: newPositionDesc.trim() })
      toast.success('Position created')
      setNewPositionName('')
      setNewPositionDesc('')
      setPositions(await fetchBusinessPositions())
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to create position')
    }
  }

  const handleDeletePosition = async (id) => {
    if (!window.confirm('Delete position?')) return
    try {
      await deleteBusinessPosition(id)
      toast.success('Position deleted')
      if (id === selectedPositionId) setSelectedPositionId(null)
      setPositions(await fetchBusinessPositions())
    } catch {
      toast.error('Failed to delete position')
    }
  }

  const handleAddFeatureActionToPosition = async (e) => {
    e.preventDefault()
    if (!selectedPositionId || !addFeatureActionId) return
    try {
      await addPositionPermission(selectedPositionId, addFeatureActionId)
      toast.success('Permission added to position')
      setAddFeatureActionId('')
      setPositionPermissions(await fetchPositionPermissions(selectedPositionId))
    } catch {
      toast.error('Failed to add')
    }
  }

  const handleRemoveFeatureActionFromPosition = async (featureActionId) => {
    if (!selectedPositionId) return
    if (!window.confirm('Remove permission from position?')) return
    try {
      await removePositionPermission(selectedPositionId, featureActionId)
      toast.success('Removed')
      setPositionPermissions(await fetchPositionPermissions(selectedPositionId))
    } catch {
      toast.error('Failed to remove')
    }
  }

  const renderPositionsTab = () => (
    <div>
      <h2 className="text-xl font-semibold mb-4">Business Positions</h2>
      <form onSubmit={handleCreatePosition} className="flex gap-2 mb-4 flex-wrap">
        <input
          className="border px-2 py-1 rounded flex-1 min-w-[200px]"
          placeholder="Position name"
          value={newPositionName}
          onChange={e => setNewPositionName(e.target.value)}
        />
        <input
          className="border px-2 py-1 rounded flex-1 min-w-[250px]"
          placeholder="Description"
          value={newPositionDesc}
          onChange={e => setNewPositionDesc(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">Add</button>
      </form>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3">
          <h3 className="font-medium mb-2">Positions</h3>
          {loading ? <p>Loading...</p> : (
            <ul className="space-y-2 max-h-64 overflow-auto border rounded p-2">
              {positions.map(p => (
                <li key={p.position_id} className={`p-2 rounded border ${selectedPositionId===p.position_id ? 'bg-blue-100 border-blue-400' : ''}`}>
                  <div className="flex justify-between items-center">
                    <span className="cursor-pointer" onClick={() => setSelectedPositionId(p.position_id)}>{p.position_name}</span>
                    <button onClick={() => handleDeletePosition(p.position_id)} className="text-xs bg-red-500 text-white px-2 py-1 rounded">Delete</button>
                  </div>
                  {p.description && <p className="text-xs text-gray-600 mt-1">{p.description}</p>}
                </li>
              ))}
              {!positions.length && <li className="text-gray-500">No positions found.</li>}
            </ul>
          )}
        </div>
        <div className="md:w-2/3">
          {!selectedPositionId && <p className="text-gray-600">Select a position to view / edit its permissions.</p>}
          {selectedPositionId && (
            <div>
              <h3 className="font-medium mb-3">Assigned Feature Actions</h3>
              <ul className="space-y-2 max-h-64 overflow-auto border rounded p-2 mb-4">
                {positionPermissions.map(pp => (
                  <li key={pp.feature_action_id} className="flex justify-between items-center p-2 rounded border">
                    <span className="font-mono text-xs">FA#{pp.feature_action_id} (feature:{pp.feature_id}, action:{pp.action_id})</span>
                    <button
                      onClick={() => handleRemoveFeatureActionFromPosition(pp.feature_action_id)}
                      className="text-xs bg-red-500 text-white px-2 py-1 rounded"
                    >Remove</button>
                  </li>
                ))}
                {(!positionPermissions || !positionPermissions.length) && <li className="text-gray-500">None assigned.</li>}
              </ul>
              <form onSubmit={handleAddFeatureActionToPosition} className="flex gap-2 items-center flex-wrap">
                <select
                  value={addFeatureActionId}
                  onChange={e => setAddFeatureActionId(e.target.value)}
                  className="border px-2 py-1 rounded min-w-[220px]"
                >
                  <option value="">Select feature action</option>
                  {featureActions.map(fa => (
                    <option key={fa.feature_action_id} value={fa.feature_action_id}>{fa.key_name} ({fa.feature_name} → {fa.action_name})</option>
                  ))}
                </select>
                <button type="submit" className="bg-blue-600 text-white px-3 py-1 rounded">Add Permission</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  const renderActive = () => {
    switch (activeTab) {
      case 'roles': return renderRolesTab()
      case 'permissions': return renderPermissionsTab()
      case 'mapping': return renderMappingTab()
      case 'featureActions': return renderFeatureActionsTab()
      case 'positions': return renderPositionsTab()
      default: return null
    }
  }

  return (
    <SuperAdminLayout>
      <div className="p-4 md:p-6">
        <h1 className="text-2xl font-bold mb-4">RBAC Management</h1>
        <div className="flex gap-2 flex-wrap mb-6 text-black">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-3 py-1 rounded border text-sm ${activeTab===t.key ? 'bg-blue-600 text-white border-blue-600' : 'bg-white hover:bg-gray-100'}`}
            >{t.label}</button>
          ))}
        </div>
        <div className="bg-white text-gray-900 rounded border p-4 shadow-sm">
          {renderActive()}
        </div>
        <ToastContainer position="top-center" autoClose={2500} />
      </div>
    </SuperAdminLayout>
  )
}
