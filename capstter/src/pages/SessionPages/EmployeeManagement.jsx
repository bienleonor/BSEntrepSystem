import { useState, useEffect } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from "../../context/AuthContext";

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingPosition, setEditingPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const selectedBusinessId = localStorage.getItem('selectedBusinessId');
  const { user } = useAuth();
  const currentUserId = user?.user_id;

  useEffect(() => {
    if (!selectedBusinessId) return;
    fetchPositions();
    fetchEmployees();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessId]);

  const fetchPositions = async () => {
    try {
      const res = await axiosInstance.get('/business/position');
      if (res?.data?.success || Array.isArray(res?.data)) {
        const data = res.data.data || res.data;
        setPositions(data || []);
      }
    } catch (err) {
      console.error('Error fetching positions', err);
    }
  };

  const fetchEmployees = async () => {
    if (!selectedBusinessId) return;
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/business/employees/${selectedBusinessId}`);
      if (res?.data?.success) {
        setEmployees(res.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching employees', err);
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (emp) => {
    setEditingUserId(emp.user_id);
    setEditingPosition(emp.bus_pos_id ?? null);
  };

  const handleCancelEdit = () => {
    setEditingUserId(null);
    setEditingPosition(null);
  };

  const handleSavePosition = async (user_id) => {
    if (!selectedBusinessId) {
      toast.error('No business selected');
      return;
    }
    try {
      const res = await axiosInstance.post('/business/assign-position', {
        user_id,
        business_id: selectedBusinessId,
        bus_pos_id: editingPosition,
      });
      if (res?.data?.success) {
        toast.success('Position updated');
        fetchEmployees();
        handleCancelEdit();
      } else {
        toast.error(res?.data?.message || 'Failed to update position');
      }
    } catch (err) {
      console.error('Error updating position', err);
      toast.error('Server error');
    }
  };

  const handleRemove = async (user_id) => {
    if (!selectedBusinessId) return toast.error('No business selected');
    if (String(user_id) === String(currentUserId)) {
      return toast.error("You can't remove yourself.");
    }
    if (!confirm('Remove this employee from the business?')) return;
    try {
      const res = await axiosInstance.delete('/business/removeemployee', {
        data: { user_id, business_id: selectedBusinessId }
      });
      if (res?.data?.success) {
        toast.success('Employee removed');
        fetchEmployees();
      } else {
        toast.error(res?.data?.message || 'Failed to remove employee');
      }
    } catch (err) {
      console.error('Error removing employee', err);
      toast.error('Server error');
    }
  };

 
  return (
    <DashboardLayout>
      <ToastContainer position="top-center" autoClose={3000} />
      <div className=" bg-slate-300 shadow-lg rounded-lg p-4 sm:p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-800">
            Employee Management
          </h1>
          
        </div>

        {/* Mobile: Card list */}
        <div className="md:hidden space-y-3">
          {employees.length === 0 ? (
            <div className="text-center py-6 text-gray-600">
              {loading ? 'Loading employees...' : 'No employees added yet.'}
            </div>
          ) : (
            employees.map((emp) => (
              <div key={emp.user_id} className="bg-white rounded-xl border border-gray-200 shadow-sm p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs text-gray-500">ID: {emp.user_id}</div>
                    <div className="font-semibold text-gray-900">{emp.first_name || emp.username} {emp.last_name || ''}</div>
                    <div className="mt-1 text-sm text-gray-700">
                      {editingUserId === emp.user_id ? (
                        <select
                          value={editingPosition ?? ''}
                          onChange={(e) => setEditingPosition(e.target.value || null)}
                          className="border rounded px-2 py-1 w-full"
                        >
                          <option value="">-- No position --</option>
                          {positions.map((pos) => (
                            <option key={pos.business_pos_id} value={pos.business_pos_id}>{pos.position_name}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs">{emp.position_name || '--no position--'}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  {editingUserId === emp.user_id ? (
                    <>
                      <button onClick={() => handleSavePosition(emp.user_id)} className="w-full sm:w-auto bg-green-600 text-white px-3 py-2 rounded text-sm">SAVE</button>
                      <button onClick={handleCancelEdit} className="w-full sm:w-auto bg-gray-500 text-white px-3 py-2 rounded text-sm">CANCEL</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEditClick(emp)} className="w-full sm:w-auto bg-blue-600 text-white px-3 py-2 rounded text-sm">EDIT</button>
                      <button
                        onClick={() => handleRemove(emp.user_id)}
                        disabled={String(emp.user_id) === String(currentUserId)}
                        title={String(emp.user_id) === String(currentUserId) ? "You can't remove yourself" : undefined}
                        className={`w-full sm:w-auto px-3 py-2 rounded text-sm ${String(emp.user_id) === String(currentUserId) ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-red-600 text-white'}`}
                      >
                        REMOVE
                      </button>
                     
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop/Tablet: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border px-4 py-3 text-left">Id</th>
                <th className="border px-4 py-3 text-left">Name</th>
                <th className="border px-4 py-3 text-left">Position</th>
                <th className="border px-4 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {employees.length === 0 ? (
                <tr>
                  <td
                    colSpan="4"
                    className="text-center py-6 text-gray-500 italic"
                  >
                    {loading ? 'Loading employees...' : 'No employees added yet.'}
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr
                    key={emp.user_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="border px-4 py-2">{emp.user_id}</td>
                    <td className="border px-4 py-2">{emp.first_name || emp.username} {emp.last_name || ''}</td>
                    <td className="border px-4 py-2">
                      {editingUserId === emp.user_id ? (
                        <select
                          value={editingPosition ?? ''}
                          onChange={(e) => setEditingPosition(e.target.value || null)}
                          className="border rounded px-2 py-1"
                        >
                          <option value="">-- No position --</option>
                          {positions.map((pos) => (
                            <option key={pos.business_pos_id} value={pos.business_pos_id}>{pos.position_name}</option>
                          ))}
                        </select>
                      ) : (
                        emp.position_name || '--no position--'
                      )}
                    </td>
                    <td className="border px-4 py-2 space-x-3">
                      {editingUserId === emp.user_id ? (
                        <>
                          <button onClick={() => handleSavePosition(emp.user_id)} className="text-green-600 font-medium hover:underline">SAVE</button>
                          <button onClick={handleCancelEdit} className="text-gray-600 font-medium hover:underline">CANCEL</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => handleEditClick(emp)} className="text-blue-600 font-medium hover:underline">EDIT</button>
                          <button
                            onClick={() => handleRemove(emp.user_id)}
                            disabled={String(emp.user_id) === String(currentUserId)}
                            title={String(emp.user_id) === String(currentUserId) ? "You can't remove yourself" : undefined}
                            className={`font-medium ${String(emp.user_id) === String(currentUserId) ? 'text-gray-400 cursor-not-allowed' : 'text-red-600 hover:underline'}`}
                          >
                            REMOVE
                          </button>
                          
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
