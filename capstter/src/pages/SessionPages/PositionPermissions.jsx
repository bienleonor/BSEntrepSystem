import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  fetchPositionsWithOverrideStatus,
  fetchEffectivePermissions,
  fetchPositionPermissions,
  fetchAvailablePermissions,
  addPermissionOverride,
  removePermissionOverride,
  resetPositionOverrides,
} from "../../services/rbacApi";

export default function PositionPermissions() {
  const [positions, setPositions] = useState([]);
  const [selectedPositionId, setSelectedPositionId] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [effectivePermissions, setEffectivePermissions] = useState([]);
  const [presetPermissions, setPresetPermissions] = useState([]);
  const [availableToAdd, setAvailableToAdd] = useState([]);
  const [overrideInfo, setOverrideInfo] = useState({ added: [], removed: [] });
  const [isCustomized, setIsCustomized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permLoading, setPermLoading] = useState(false);
  const [addFeatureActionId, setAddFeatureActionId] = useState('');

  const selectedBusinessId = localStorage.getItem('selectedBusinessId');

  useEffect(() => {
    if (!selectedBusinessId) return;
    loadPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessId]);

  const loadPositions = async () => {
    setLoading(true);
    try {
      const posData = await fetchPositionsWithOverrideStatus(selectedBusinessId);
      setPositions(posData);
    } catch {
      toast.error('Failed to load positions');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPosition = async (position) => {
    setSelectedPositionId(position.business_pos_id);
    setSelectedPosition(position);
    setPermLoading(true);
    
    try {
      const [effectiveData, presetData, availableData] = await Promise.all([
        fetchEffectivePermissions(selectedBusinessId, position.business_pos_id),
        fetchPositionPermissions(position.business_pos_id),
        fetchAvailablePermissions(selectedBusinessId, position.business_pos_id),
      ]);
      
      setEffectivePermissions(effectiveData.permissions || []);
      setPresetPermissions(presetData);
      setAvailableToAdd(availableData);
      setOverrideInfo(effectiveData.overrides || { added: [], removed: [] });
      setIsCustomized(effectiveData.isCustomized);
    } catch {
      toast.error('Failed to load permissions');
    } finally {
      setPermLoading(false);
    }
  };

  const handleResetToPreset = async () => {
    if (!selectedPositionId) return;
    if (!window.confirm('Reset to preset? This will remove all customizations.')) return;
    try {
      await resetPositionOverrides(selectedBusinessId, selectedPositionId);
      toast.success('Reset to preset permissions');
      await handleSelectPosition(selectedPosition);
      loadPositions();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to reset');
    }
  };

  // Add a permission (create ADD override)
  const handleAddPermission = async (e) => {
    e.preventDefault();
    if (!selectedPositionId || !addFeatureActionId) return;
    try {
      await addPermissionOverride(selectedBusinessId, selectedPositionId, addFeatureActionId, 'ADD');
      toast.success('Permission added');
      setAddFeatureActionId('');
      await handleSelectPosition(selectedPosition);
      loadPositions();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to add permission');
    }
  };

  // Remove a permission
  const handleRemovePermission = async (featureActionId, isAdded) => {
    if (!selectedPositionId) return;
    
    const isPreset = presetPermissions.some(p => p.feature_action_id === featureActionId);
    
    if (isAdded) {
      // If it was added via override, just remove the override
      if (!window.confirm('Remove this added permission?')) return;
      try {
        await removePermissionOverride(selectedBusinessId, selectedPositionId, featureActionId);
        toast.success('Permission removed');
      } catch (e) {
        toast.error(e.response?.data?.error || 'Failed to remove');
      }
    } else if (isPreset) {
      // If it's from preset, create a REMOVE override
      if (!window.confirm('Remove this preset permission? (It will be marked as removed)')) return;
      try {
        await addPermissionOverride(selectedBusinessId, selectedPositionId, featureActionId, 'REMOVE');
        toast.success('Permission removed from this position');
      } catch (e) {
        toast.error(e.response?.data?.error || 'Failed to remove');
      }
    }
    
    await handleSelectPosition(selectedPosition);
    loadPositions();
  };

  // Restore a removed preset permission
  const handleRestorePermission = async (featureActionId) => {
    if (!selectedPositionId) return;
    try {
      await removePermissionOverride(selectedBusinessId, selectedPositionId, featureActionId);
      toast.success('Permission restored');
      await handleSelectPosition(selectedPosition);
      loadPositions();
    } catch (e) {
      toast.error(e.response?.data?.error || 'Failed to restore');
    }
  };

  const getPermDisplay = (perm) => {
    if (perm.permission_key) return perm.permission_key;
    if (perm.feature_name && perm.action_name) return `${perm.feature_name}:${perm.action_name}`;
    return `FA#${perm.feature_action_id}`;
  };

  // Get removed preset permissions (for showing "Removed" section)
  const removedPresets = presetPermissions.filter(p => 
    overrideInfo.removed.includes(p.feature_action_id)
  );

  if (!selectedBusinessId) {
    return (
      <DashboardLayout>
        <div className="p-6 text-center text-gray-600">
          Please select a business first.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Position Permissions
        </h1>
        <p className="text-gray-600 mb-6">
          Customize what each position can do in your business. Add or remove permissions from the preset.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left: Position List */}
          <div className="bg-white rounded-lg shadow p-4">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Positions</h2>
            {loading ? (
              <p className="text-gray-500">Loading...</p>
            ) : (
              <ul className="space-y-2 max-h-96 overflow-auto">
                {positions.map((pos) => (
                  <li
                    key={pos.business_pos_id}
                    onClick={() => handleSelectPosition(pos)}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedPositionId === pos.business_pos_id
                        ? 'bg-blue-50 border-blue-400'
                        : 'hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{pos.position_name}</span>
                      {pos.isCustomized ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                          {pos.add_count > 0 && `+${pos.add_count}`}
                          {pos.add_count > 0 && pos.remove_count > 0 && ' / '}
                          {pos.remove_count > 0 && `-${pos.remove_count}`}
                        </span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">Preset</span>
                      )}
                    </div>
                  </li>
                ))}
                {positions.length === 0 && (
                  <li className="text-gray-500 text-sm">No positions found.</li>
                )}
              </ul>
            )}
          </div>

          {/* Right: Permission Details */}
          <div className="md:col-span-2 bg-white rounded-lg shadow p-4">
            {!selectedPositionId ? (
              <p className="text-gray-600">Select a position to view and customize its permissions.</p>
            ) : permLoading ? (
              <p className="text-gray-500">Loading permissions...</p>
            ) : (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-700">
                      {selectedPosition?.position_name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {isCustomized ? (
                        <span className="text-green-600">
                          ✓ Customized ({overrideInfo.added.length} added, {overrideInfo.removed.length} removed)
                        </span>
                      ) : (
                        <span>Using preset permissions</span>
                      )}
                    </p>
                  </div>
                  {isCustomized && (
                    <button
                      onClick={handleResetToPreset}
                      className="bg-gray-500 text-white px-3 py-1.5 rounded text-sm font-medium hover:bg-gray-600"
                    >
                      ↩ Reset to Default
                    </button>
                  )}
                </div>

                {/* Effective Permissions */}
                <h3 className="font-medium text-gray-700 mb-2">
                  Effective Permissions ({effectivePermissions.length})
                </h3>
                <ul className="space-y-1 max-h-48 overflow-auto border rounded p-2 mb-4">
                  {effectivePermissions.map((p) => (
                    <li key={p.feature_action_id} className={`flex justify-between items-center px-2 py-1.5 rounded ${
                      p.isAdded ? 'bg-green-50' : 'bg-gray-50'
                    }`}>
                      <span className="text-sm font-mono flex items-center gap-2">
                        {getPermDisplay(p)}
                        {p.isAdded && <span className="text-xs bg-green-200 text-green-800 px-1 rounded">Added</span>}
                      </span>
                      <button
                        onClick={() => handleRemovePermission(p.feature_action_id, p.isAdded)}
                        className="text-xs bg-red-500 text-white px-2 py-0.5 rounded hover:bg-red-600"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                  {effectivePermissions.length === 0 && (
                    <li className="text-gray-400 text-sm p-2">No permissions assigned.</li>
                  )}
                </ul>

                {/* Removed Preset Permissions */}
                {removedPresets.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-medium text-red-700 mb-2 text-sm">
                      Removed from Preset ({removedPresets.length})
                    </h3>
                    <ul className="space-y-1 border border-red-200 rounded p-2 bg-red-50">
                      {removedPresets.map((p) => (
                        <li key={p.feature_action_id} className="flex justify-between items-center px-2 py-1">
                          <span className="text-sm font-mono text-red-600 line-through">{getPermDisplay(p)}</span>
                          <button
                            onClick={() => handleRestorePermission(p.feature_action_id)}
                            className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600"
                          >
                            Restore
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Add Permission */}
                <div className="border-t pt-4">
                  <h3 className="font-medium text-gray-700 mb-2">Add Permission</h3>
                  <form onSubmit={handleAddPermission} className="flex gap-2 flex-wrap">
                    <select
                      value={addFeatureActionId}
                      onChange={(e) => setAddFeatureActionId(e.target.value)}
                      className="flex-1 min-w-[200px] border rounded px-2 py-1.5 text-sm"
                    >
                      <option value="">Select permission to add...</option>
                      {availableToAdd.map(fa => (
                        <option key={fa.feature_action_id} value={fa.feature_action_id}>
                          {fa.feature_name}:{fa.action_name}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={!addFeatureActionId}
                      className="bg-green-600 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-green-700 disabled:bg-gray-300"
                    >
                      + Add
                    </button>
                  </form>
                  {availableToAdd.length === 0 && (
                    <p className="text-xs text-gray-400 mt-2">All available permissions are already assigned.</p>
                  )}
                </div>

                {/* Preset Reference */}
                <div className="border-t pt-4 mt-4">
                  <h3 className="font-medium text-gray-500 mb-2 text-sm">
                    Original Preset ({presetPermissions.length} permissions)
                  </h3>
                  <div className="text-xs text-gray-400 flex flex-wrap gap-1 max-h-20 overflow-auto">
                    {presetPermissions.map(p => (
                      <span 
                        key={p.feature_action_id} 
                        className={`px-2 py-0.5 rounded ${
                          overrideInfo.removed.includes(p.feature_action_id) 
                            ? 'bg-red-100 line-through' 
                            : 'bg-gray-100'
                        }`}
                      >
                        {getPermDisplay(p)}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-800 mb-2">💡 How Permission Customization Works</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• <strong>Preset</strong> permissions are the default set created by the system admin.</li>
            <li>• You can <strong>add extra permissions</strong> that aren't in the preset.</li>
            <li>• You can <strong>remove preset permissions</strong> you don't want for this position.</li>
            <li>• Removed permissions show up in the "Removed" section and can be <strong>restored</strong>.</li>
            <li>• Click <strong>"Reset to Default"</strong> to remove all customizations and use the preset.</li>
            <li>• Your customizations only affect <strong>your business</strong>, not others.</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
