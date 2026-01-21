import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { OrderPopup } from "../../components/common/OrderPopup";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function BusinessPositionManagement() {
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  
  // Permission states
  const [effectivePermissions, setEffectivePermissions] = useState(null);
  const [availablePermissions, setAvailablePermissions] = useState([]);
  const [permissionsLoading, setPermissionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current'); // 'current' | 'add' | 'remove'
  
  const businessId = localStorage.getItem("selectedBusinessId");

  const fetchPositions = async () => {
    try {
      setLoading(true);
      // Get positions with override status
      const res = await axiosInstance.get(`/business/positions/business/${businessId}/override-status`);
      setPositions(res.data.data || res.data || []);
    } catch (error) {
      console.error("Failed to fetch positions:", error);
      // Fallback to regular positions endpoint
      try {
        const fallbackRes = await axiosInstance.get("/business/position");
        setPositions(fallbackRes.data.data || []);
      } catch {
        toast.error("Failed to load positions");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const fetchEffectivePermissions = async (positionId) => {
    try {
      setPermissionsLoading(true);
      const [effectiveRes, availableRes] = await Promise.all([
        axiosInstance.get(`/business/positions/business/${businessId}/positions/${positionId}/effective-permissions`),
        axiosInstance.get(`/business/positions/business/${businessId}/positions/${positionId}/available-permissions`)
      ]);
      setEffectivePermissions(effectiveRes.data.data || effectiveRes.data);
      setAvailablePermissions(availableRes.data.data || availableRes.data || []);
    } catch (error) {
      console.error("Failed to fetch permissions:", error);
      toast.error("Failed to load permissions");
    } finally {
      setPermissionsLoading(false);
    }
  };

  // --- Edit popup handlers ---
  const handleEditClick = async (pos) => {
    setSelectedPosition(pos);
    setActiveTab('current');
    setIsEditPopupOpen(true);
    await fetchEffectivePermissions(pos.business_pos_id);
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedPosition(null);
    setEffectivePermissions(null);
    setAvailablePermissions([]);
  };

  // --- Add popup handlers ---
  const handleOpenAddPopup = () => {
    setIsAddPopupOpen(true);
    setNewRoleName("");
  };

  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post("/business/position", {
        position_name: newRoleName,
      });
      toast.success("Position added successfully");
      fetchPositions();
      handleCloseAddPopup();
    } catch (error) {
      console.error("Error adding position:", error);
      toast.error("Failed to add position");
    }
  };

  // --- Permission Override Handlers ---
  const handleAddPermission = async (featureActionId) => {
    if (!selectedPosition) return;
    try {
      await axiosInstance.post(`/business/positions/business/${businessId}/positions/${selectedPosition.business_pos_id}/overrides`, {
        featureActionId,
        overrideType: 'ADD'
      });
      toast.success("Permission added");
      await fetchEffectivePermissions(selectedPosition.business_pos_id);
      fetchPositions(); // Refresh override status
    } catch (error) {
      console.error("Failed to add permission:", error);
      toast.error("Failed to add permission");
    }
  };

  const handleRemovePermission = async (featureActionId, isPreset) => {
    if (!selectedPosition) return;
    try {
      if (isPreset) {
        // For preset permissions, add a REMOVE override
        await axiosInstance.post(`/business/positions/business/${businessId}/positions/${selectedPosition.business_pos_id}/overrides`, {
          featureActionId,
          overrideType: 'REMOVE'
        });
        toast.success("Permission removed (override created)");
      } else {
        // For added permissions, remove the override entirely
        await axiosInstance.delete(`/business/positions/business/${businessId}/positions/${selectedPosition.business_pos_id}/overrides/${featureActionId}`);
        toast.success("Permission removed");
      }
      await fetchEffectivePermissions(selectedPosition.business_pos_id);
      fetchPositions();
    } catch (error) {
      console.error("Failed to remove permission:", error);
      toast.error("Failed to remove permission");
    }
  };

  const handleRestorePermission = async (featureActionId) => {
    if (!selectedPosition) return;
    try {
      await axiosInstance.delete(`/business/positions/business/${businessId}/positions/${selectedPosition.business_pos_id}/overrides/${featureActionId}`);
      toast.success("Permission restored to default");
      await fetchEffectivePermissions(selectedPosition.business_pos_id);
      fetchPositions();
    } catch (error) {
      console.error("Failed to restore permission:", error);
      toast.error("Failed to restore permission");
    }
  };

  const handleResetToDefault = async () => {
    if (!selectedPosition) return;
    if (!window.confirm(`Reset all permissions for "${selectedPosition.position_name}" to default? This will remove all overrides.`)) return;
    
    try {
      await axiosInstance.delete(`/business/positions/business/${businessId}/positions/${selectedPosition.business_pos_id}/overrides`);
      toast.success("Permissions reset to default");
      await fetchEffectivePermissions(selectedPosition.business_pos_id);
      fetchPositions();
    } catch (error) {
      console.error("Failed to reset permissions:", error);
      toast.error("Failed to reset permissions");
    }
  };

  // Group permissions by feature
  const groupPermissionsByFeature = (permissions) => {
    const grouped = {};
    (permissions || []).forEach(p => {
      const feature = p.feature_name || 'Other';
      if (!grouped[feature]) grouped[feature] = [];
      grouped[feature].push(p);
    });
    return grouped;
  };

  return (
    <DashboardLayout>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />
      
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-black">
              Business Positions
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage position permissions and customize access for your business
            </p>
          </div>
          <button
            onClick={handleOpenAddPopup}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Position
          </button>
        </div>

        {/* Positions Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-48 text-black">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {positions.length === 0 ? (
              <div className="col-span-full text-center py-12 text-gray-500">
                No positions found.
              </div>
            ) : (
              positions.map((pos) => {
                const isOwner = pos.business_pos_id === 1 || pos.position_name?.toLowerCase() === 'owner';
                return (
                <div 
                  key={pos.business_pos_id} 
                  className="bg-white backdrop-blur-sm rounded-xl p-5 border border-gray-300 hover:border-gray-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-black">{pos.position_name}</h3>
                      <p className="text-gray-600 text-sm">ID: {pos.business_pos_id}</p>
                    </div>
                    <div className="flex gap-2">
                      {isOwner && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-600 text-xs rounded-full">
                          Protected
                        </span>
                      )}
                      {pos.isCustomized && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                          Customized
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {pos.override_count > 0 && (
                    <div className="flex gap-2 mb-3 text-xs">
                      {pos.add_count > 0 && (
                        <span className="px-2 py-1 bg-green-100 text-green-600 rounded">
                          +{pos.add_count} added
                        </span>
                      )}
                      {pos.remove_count > 0 && (
                        <span className="px-2 py-1 bg-red-100 text-red-600 rounded">
                          -{pos.remove_count} removed
                        </span>
                      )}
                    </div>
                  )}
                  
                  {isOwner ? (
                    <div className="w-full mt-2 px-4 py-2 bg-gray-100 text-gray-500 rounded-lg text-center text-sm">
                      <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Owner permissions cannot be modified
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEditClick(pos)}
                      className="w-full mt-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-lg transition flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View & Edit Permissions
                    </button>
                  )}
                </div>
              );})
            )}
          </div>
        )}
      </div>

      {/* Edit Permissions Popup */}
      <OrderPopup
        isOpen={isEditPopupOpen}
        onClose={handleCloseEditPopup}
        title={`Permissions: ${selectedPosition?.position_name || ''}`}
      >
        {selectedPosition && (
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-gray-300 pb-2">
              <button
                onClick={() => setActiveTab('current')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'current' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Current Permissions
              </button>
              <button
                onClick={() => setActiveTab('add')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                  activeTab === 'add' 
                    ? 'bg-green-600 text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Add Permission
              </button>
              {effectivePermissions?.presetPermissions?.length > 0 && effectivePermissions?.overrides?.removed?.length > 0 && (
                <button
                  onClick={() => setActiveTab('removed')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                    activeTab === 'removed' 
                      ? 'bg-red-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Removed ({effectivePermissions.overrides.removed.length})
                </button>
              )}
            </div>

            {permissionsLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Loading permissions...
              </div>
            ) : (
              <>
                {/* Current Permissions Tab */}
                {activeTab === 'current' && (
                  <div className="space-y-3">
                    {effectivePermissions?.isCustomized && (
                      <div className="flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <span className="text-yellow-700 text-sm">
                          This position has custom overrides
                        </span>
                        <button
                          onClick={handleResetToDefault}
                          className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded-lg transition"
                        >
                          Reset to Default
                        </button>
                      </div>
                    )}
                    
                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                      {effectivePermissions?.permissions?.length > 0 ? (
                        Object.entries(groupPermissionsByFeature(effectivePermissions.permissions)).map(([feature, perms]) => (
                          <div key={feature} className="bg-gray-100 rounded-lg p-3">
                            <h4 className="text-black font-medium mb-2 capitalize">{feature.replace(/_/g, ' ')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {perms.map((perm) => (
                                <div 
                                  key={perm.feature_action_id}
                                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                                    perm.isAdded 
                                      ? 'bg-green-100 text-green-600 border border-green-200' 
                                      : 'bg-gray-200 text-gray-700'
                                  }`}
                                >
                                  <span className="capitalize">{perm.action_name}</span>
                                  {perm.isAdded && (
                                    <span className="text-xs text-green-600">(added)</span>
                                  )}
                                  <button
                                    onClick={() => handleRemovePermission(perm.feature_action_id, perm.isPreset)}
                                    className="ml-1 text-red-600 hover:text-red-700"
                                    title="Remove permission"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No permissions assigned to this position.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Add Permission Tab */}
                {activeTab === 'add' && (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      Select permissions to add to this position (these will override the default)
                    </p>
                    <div className="max-h-[400px] overflow-y-auto space-y-3 pr-1">
                      {availablePermissions.length > 0 ? (
                        Object.entries(groupPermissionsByFeature(availablePermissions)).map(([feature, perms]) => (
                          <div key={feature} className="bg-gray-100 rounded-lg p-3">
                            <h4 className="text-black font-medium mb-2 capitalize">{feature.replace(/_/g, ' ')}</h4>
                            <div className="flex flex-wrap gap-2">
                              {perms.map((perm) => (
                                <button
                                  key={perm.feature_action_id}
                                  onClick={() => handleAddPermission(perm.feature_action_id)}
                                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-green-100 text-gray-700 hover:text-green-600 rounded-lg text-sm transition border border-transparent hover:border-green-200"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  <span className="capitalize">{perm.action_name}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          All available permissions are already assigned.
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Removed Permissions Tab */}
                {activeTab === 'removed' && (
                  <div className="space-y-3">
                    <p className="text-gray-600 text-sm">
                      These preset permissions have been removed via override. Click to restore.
                    </p>
                    <div className="max-h-[400px] overflow-y-auto space-y-2 pr-1">
                      {effectivePermissions?.presetPermissions
                        ?.filter(p => effectivePermissions.overrides.removed.includes(p.feature_action_id))
                        .map((perm) => (
                          <div 
                            key={perm.feature_action_id}
                            className="flex items-center justify-between bg-red-50 border border-red-200 rounded-lg p-3"
                          >
                            <span className="text-red-700">
                              {perm.feature_name}:{perm.action_name}
                            </span>
                            <button
                              onClick={() => handleRestorePermission(perm.feature_action_id)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition"
                            >
                              Restore
                            </button>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Close button */}
            <div className="flex justify-end pt-3 border-t border-gray-300">
              <button
                onClick={handleCloseEditPopup}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </OrderPopup>

      {/* Add Position Popup */}
      <OrderPopup
        isOpen={isAddPopupOpen}
        onClose={handleCloseAddPopup}
        title="Add New Position"
      >
        <form className="space-y-4" onSubmit={handleAddSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Position Name</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Cashier, Manager, etc."
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={handleCloseAddPopup}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
            >
              Create Position
            </button>
          </div>
        </form>
      </OrderPopup>
    </DashboardLayout>
  );
}
