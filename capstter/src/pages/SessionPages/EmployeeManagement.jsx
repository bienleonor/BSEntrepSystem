import { useState, useEffect } from "react";
import { getUserId } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [positions, setPositions] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editingPosition, setEditingPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userId = getUserId();
  const selectedBusinessId = localStorage.getItem('selectedBusinessId');

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
      <div className=" bg-slate-300 shadow-lg rounded-lg p-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Employee Management
          </h1>
          
        </div>

        

        {/* Table */}
        <div className="overflow-x-auto">
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
                            <option key={pos.business_pos_id} value={pos.business_pos_id}>{pos.role_name}</option>
                          ))}
                        </select>
                      ) : (
                        emp.role_name || '--no position--'
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
                          <button onClick={() => handleRemove(emp.user_id)} className="text-red-600 font-medium hover:underline">REMOVE</button>
                          <button className="text-gray-600 font-medium hover:underline">VIEW</button>
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
