import React, { useEffect, useState, useCallback } from 'react';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { OrderPopup } from '../../components/common/OrderPopup';

const BusinessManagement = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);
  const [viewingBiz, setViewingBiz] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [empError, setEmpError] = useState(null);
  const [employeesRequested, setEmployeesRequested] = useState(false);

  const fetchBusinesses = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/business/businesses', {
        params: { status: filter === 'ALL' ? undefined : filter }
      });
      const mapped = (response.data || []).map((r) => ({
        id: r.business_id,
        name: r.business_name,
        owner: r.owner,
        code: r.business_cat_id ?? '—',
        status: r.status === 1 ? 'ACTIVE' : r.status === 0 ? 'OFFLINE' : '—',
      }));
      setBusinesses(mapped);
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  }, [filter]);

  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleCreateBusiness = () => {
    // Navigate to business creation page or open modal
  };

  const handleDeleteBusiness = async (id) => {
    const confirmed = window.confirm('Delete this business? This cannot be undone.');
    if (!confirmed) return;
    try {
      setDeletingId(id);
      await axiosInstance.delete(`/business/deletebusiness/${id}`);
      setBusinesses((prev) => prev.filter((b) => b.id !== id));
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business.');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <SuperAdminLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Manage Businesses</h1>
          
        </div>

        <div className="flex gap-4">
          {['ACTIVE', 'OFFLINE', 'ALL'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded ${
                filter === status
                  ? status === 'ACTIVE'
                    ? 'bg-green-500 text-white'
                    : status === 'OFFLINE'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-300'
                  : 'bg-gray-100'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left">
              <th className="p-2">#</th>
              <th className="p-2">Business Name</th>
              <th className="p-2">Owner</th>
              <th className="p-2">Code</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {businesses.map((biz, index) => (
              <tr key={biz.id} className="border-b">
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{biz.name}</td>
                <td className="p-2">{biz.owner}</td>
                <td className="p-2">{biz.code}</td>
                <td className="p-2">{biz.status}</td>
                <td className="p-2 space-x-2">
                  <button
                    onClick={() => setViewingBiz(biz)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    View
                  </button>
                  <button className="bg-yellow-500 text-white px-2 py-1 rounded">Edit</button>
                  <button
                    onClick={() => handleDeleteBusiness(biz.id)}
                    disabled={deletingId === biz.id}
                    className={`px-2 py-1 rounded text-white ${deletingId === biz.id ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'}`}
                  >
                    {deletingId === biz.id ? 'Deleting…' : 'Delete'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {viewingBiz && (
          <OrderPopup
            isOpen={!!viewingBiz}
            title={viewingBiz.name}
            onClose={() => setViewingBiz(null)}
          >
            <div className="space-y-3">
              <button
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  const load = async () => {
                    setEmployeesRequested(true);
                    setLoadingEmployees(true);
                    setEmpError(null);
                    setEmployees([]);
                    try {
                      // Mirror EmployeeManagement.jsx response handling
                      const res = await axiosInstance.get(`/business/employees/${viewingBiz.id}`);
                      let dataPayload = [];
                      if (res?.data?.success) {
                        dataPayload = res.data.data || [];
                      } else if (Array.isArray(res?.data)) {
                        dataPayload = res.data;
                      }
                      setEmployees(Array.isArray(dataPayload) ? dataPayload : []);
                    } catch (e) {
                      console.error('Failed to load employees', e);
                      setEmpError('Failed to load employees');
                    } finally {
                      setLoadingEmployees(false);
                    }
                  };
                  load();
                }}
              >
                View Employees
              </button>
              <button
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
                onClick={() => {
                  setViewingBiz(null);
                  window.dispatchEvent(new CustomEvent('navigate:view-products', { detail: { businessId: viewingBiz.id } }));
                }}
              >
                View Products
              </button>
            </div>
            {employeesRequested && (
              <div className="mt-4 border-t pt-4">
                <h3 className="text-md font-semibold mb-2">Employees</h3>
                {loadingEmployees && <div className="text-sm text-gray-600">Loading employees…</div>}
                {empError && <div className="text-sm text-red-600">{empError}</div>}
                {!loadingEmployees && !empError && employees.length === 0 && (
                  <div className="text-sm text-gray-600">No employees found.</div>
                )}
                {!loadingEmployees && !empError && employees.length > 0 && (
                  <div className="max-h-64 overflow-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left">
                          <th className="py-1 pr-2">User</th>
                          <th className="py-1 pr-2">Name</th>
                          <th className="py-1 pr-2">Contact</th>
                          <th className="py-1 pr-2">Position</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((e) => (
                          <tr key={`${e.user_id}-${e.business_id}`} className="border-t">
                            <td className="py-1 pr-2">{e.username || '—'}</td>
                            <td className="py-1 pr-2">{[e.first_name, e.last_name].filter(Boolean).join(' ') || '—'}</td>
                            <td className="py-1 pr-2">{e.contact_no || '—'}</td>
                            <td className="py-1 pr-2">{e.position_name || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </OrderPopup>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default BusinessManagement;