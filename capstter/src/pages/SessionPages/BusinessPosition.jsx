import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { OrderPopup } from "../../components/common/OrderPopup";
import axiosInstance from "../../utils/axiosInstance";

export default function BusinessPositionManagement() {
  const [positions, setPositions] = useState([]);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [newRoleName, setNewRoleName] = useState("");
  const [newPermissions, setNewPermissions] = useState("");

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axiosInstance.get("/business/position");
        setPositions(res.data.data);
      } catch (error) {
        console.error("Failed to fetch positions:", error);
      }
    };
    fetchPositions();
  }, []);

  // --- Edit popup handlers ---
  const handleEditClick = (pos) => {
    setSelectedPosition(pos);
    setIsEditPopupOpen(true);
  };
  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedPosition(null);
  };

  // --- Add popup handlers ---
  const handleOpenAddPopup = () => {
    setIsAddPopupOpen(true);
    setNewRoleName("");
    setNewPermissions("");
  };
  const handleCloseAddPopup = () => {
    setIsAddPopupOpen(false);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.post("/business/position", {
        role_name: newRoleName,
        permissions: newPermissions,
      });
      // Update table with new position
      setPositions((prev) => [...prev, res.data.data]);
      handleCloseAddPopup();
    } catch (error) {
      console.error("Error adding position:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="bg-bronze shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Business Position
          </h1>
          <div className="space-x-4">
            <button
              onClick={handleOpenAddPopup}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              + ADD NEW ROLES
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-3 text-left">Id</th>
                <th className="border px-4 py-3 text-left">Position</th>
                <th className="border px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {positions.length === 0 ? (
                <tr>
                  <td colSpan="3" className="text-center py-6 text-gray-500 italic">
                    No positions found.
                  </td>
                </tr>
              ) : (
                positions.map((pos) => (
                  <tr key={pos.business_pos_id} className="hover:bg-gray-50 transition-colors">
                    <td className="border px-4 py-2">{pos.business_pos_id}</td>
                    <td className="border px-4 py-2">{pos.role_name}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditClick(pos)}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        EDIT
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Popup */}
      <OrderPopup
        isOpen={isEditPopupOpen}
        onClose={handleCloseEditPopup}
        title="Edit Position"
      >
        {selectedPosition ? (
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Role Name</label>
              <input
                type="text"
                defaultValue={selectedPosition.role_name}
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Permissions</label>
              <textarea
                placeholder="Enter permissions here..."
                className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
                rows={3}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={handleCloseEditPopup}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save
              </button>
            </div>
          </form>
        ) : (
          <p>No position selected.</p>
        )}
      </OrderPopup>

      {/* Add Popup */}
      <OrderPopup
        isOpen={isAddPopupOpen}
        onClose={handleCloseAddPopup}
        title="Add New Position"
      >
        <form className="space-y-4" onSubmit={handleAddSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role Name</label>
            <input
              type="text"
              value={newRoleName}
              onChange={(e) => setNewRoleName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCloseAddPopup}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </OrderPopup>
    </DashboardLayout>
  );
}
