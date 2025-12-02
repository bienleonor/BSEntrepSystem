import React, { useEffect, useState, useCallback } from 'react';
import SuperAdminLayout from '../../components/layout/SuperAdminLayout';
import axiosInstance from '../../utils/axiosInstance';
import { AdminPopup } from '../../components/common/AdminPopUp';

// Mobile card used for small screens
const MobileCard = ({ biz, index, onView, onEdit, onDelete, deletingId }) => (
  <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 mb-3 border">
    <div className="flex justify-between items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-500">{index + 1}.</div>
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate">{biz.name}</div>
            <div className="text-xs text-gray-500 truncate">{biz.owner}</div>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap gap-2 items-center">
          <div className="text-xs text-gray-600">Code: <span className="font-medium">{biz.code}</span></div>
          <div>
            <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-block ${
              biz.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-300' :
              biz.status === 'OFFLINE' ? 'bg-red-100 text-red-700 border border-red-300' :
              'bg-gray-100 text-gray-600 border border-gray-300'
            }`}>{biz.status}</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => onView(biz)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
        >
          View
        </button>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(biz)}
            className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(biz.id)}
            disabled={deletingId === biz.id}
            className={`px-3 py-1 rounded text-white text-sm ${
              deletingId === biz.id ? 'bg-rose-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
            }`}
          >
            {deletingId === biz.id ? 'Deleting…' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PaginationControls = ({ page, totalPages, setPage }) => {
  if (totalPages <= 1) return null;
  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center gap-2 mt-3 flex-wrap">
      <button
        onClick={() => setPage(1)}
        disabled={page === 1}
        className="px-2 py-1 rounded border text-sm disabled:opacity-50"
      >
        « First
      </button>
      <button
        onClick={() => setPage(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-2 py-1 rounded border text-sm disabled:opacity-50"
      >
        ‹ Prev
      </button>

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => setPage(p)}
          className={`px-2 py-1 rounded text-sm ${p === page ? 'bg-gray-800 text-white' : 'border'}`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => setPage(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="px-2 py-1 rounded border text-sm disabled:opacity-50"
      >
        Next ›
      </button>
      <button
        onClick={() => setPage(totalPages)}
        disabled={page === totalPages}
        className="px-2 py-1 rounded border text-sm disabled:opacity-50"
      >
        Last »
      </button>
      <div className="text-sm text-gray-600 ml-2">Page {page} of {totalPages}</div>
    </div>
  );
};

const BusinessManagement = () => {
  const [businesses, setBusinesses] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [deletingId, setDeletingId] = useState(null);
  const [viewingBiz, setViewingBiz] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [empError, setEmpError] = useState(null);
  const [employeesRequested, setEmployeesRequested] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [prodError, setProdError] = useState(null);
  const [productsRequested, setProductsRequested] = useState(false);
  // Action states
  const [positions, setPositions] = useState([]);
  const [loadingPositions, setLoadingPositions] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [editingPositionId, setEditingPositionId] = useState(null);
  const [updatingEmployee, setUpdatingEmployee] = useState(false);
  const [removingEmployeeId, setRemovingEmployeeId] = useState(null);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [activeTab, setActiveTab] = useState(null); // 'employees' | 'products'
  const [employeeSearch, setEmployeeSearch] = useState('');
  const [productSearch, setProductSearch] = useState('');
  const [businessSearch, setBusinessSearch] = useState('');
  // Edit popup states
  const [editOpen, setEditOpen] = useState(false);
  const [editBizId, setEditBizId] = useState(null);
  const [editBusinessName, setEditBusinessName] = useState('');
  const [editBusinessType, setEditBusinessType] = useState('');
  const [editCategories, setEditCategories] = useState([]);
  const [editLoadingCategories, setEditLoadingCategories] = useState(false);
  const [editLogo, setEditLogo] = useState(null);
  const [editLogoPreview, setEditLogoPreview] = useState(null);
  const [editAccessCode, setEditAccessCode] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  // Pagination states for businesses
  const [bizPage, setBizPage] = useState(1);
  const [bizPageSize, setBizPageSize] = useState(8);

  // Pagination states for employees/products
  const [employeesPage, setEmployeesPage] = useState(1);
  const [employeesPageSize, setEmployeesPageSize] = useState(6);
  const [productsPage, setProductsPage] = useState(1);
  const [productsPageSize, setProductsPageSize] = useState(6);

  const fetchPositions = async () => {
    if (positions.length > 0) return; // cache
    try {
      setLoadingPositions(true);
      const res = await axiosInstance.get('/business/position');
      const data = Array.isArray(res?.data) ? res.data : (res?.data?.data || res.data?.positions || []);
      setPositions(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error('Failed to load positions', e);
    } finally {
      setLoadingPositions(false);
    }
  };

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
      setBizPage(1); // reset to first page when data changes
    } catch (error) {
      console.error('Error fetching businesses:', error);
    }
  }, [filter]);

  const openEditPopup = async (biz) => {
    setEditOpen(true);
    setEditBizId(biz.id);
    setEditBusinessName('');
    setEditBusinessType('');
    setEditCategories([]);
    setEditLoadingCategories(true);
    setEditLogo(null);
    setEditLogoPreview(null);
    setEditAccessCode('');
    try {
      // Fetch settings for this business
      const settingsRes = await axiosInstance.get('/business/settings', { params: { businessId: biz.id }, headers: { 'X-Business-ID': String(biz.id) } });
      const s = settingsRes.data?.settings || {};
      setEditBusinessName(s.business_name || '');
      setEditBusinessType(s.business_cat_id || '');
      if (s.logo) {
        const base = (axiosInstance.defaults.baseURL || '').replace('/api', '');
        const full = s.logo.startsWith('http') ? s.logo : `${base}${s.logo}`;
        setEditLogoPreview(full);
      }
      // Fetch categories
      try {
        const catRes = await axiosInstance.get('/business/categories', { headers: { 'X-Business-ID': String(biz.id) } });
        setEditCategories(Array.isArray(catRes.data) ? catRes.data : []);
      } catch {
        setEditCategories([]);
      }
      // Fetch access code
      try {
        const codeRes = await axiosInstance.get('/business/access-code', { params: { businessId: biz.id }, headers: { 'X-Business-ID': String(biz.id) } });
        setEditAccessCode(codeRes.data?.code || '');
      } catch {
        setEditAccessCode('');
      }
    } catch (err) {
      console.error('Failed to load business edit data', err);
    } finally {
      setEditLoadingCategories(false);
    }
  };

  const closeEditPopup = () => {
    setEditOpen(false);
    setEditBizId(null);
    setEditBusinessName('');
    setEditBusinessType('');
    setEditCategories([]);
    setEditLoadingCategories(false);
    setEditLogo(null);
    setEditLogoPreview(null);
    setEditAccessCode('');
    setEditSaving(false);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!editBizId) return;
    const formData = new FormData();
    formData.append('businessId', String(editBizId));
    formData.append('businessName', editBusinessName);
    formData.append('businessType', editBusinessType);
    if (editLogo) formData.append('logo', editLogo);
    try {
      setEditSaving(true);
      const res = await axiosInstance.post('/business/settings', formData, { headers: { 'X-Business-ID': String(editBizId) } });
      // Update preview if logo returned
      if (res.data?.settings?.logo) {
        const base = (axiosInstance.defaults.baseURL || '').replace('/api', '');
        const logoUrl = res.data.settings.logo.startsWith('http') ? res.data.settings.logo : `${base}${res.data.settings.logo}`;
        setEditLogoPreview(logoUrl);
      }
      // Refresh businesses list
      await fetchBusinesses();
      closeEditPopup();
      alert('Business settings saved');
    } catch (error) {
      console.error('Failed to save business settings:', error);
      alert('Failed to save settings.');
    } finally {
      setEditSaving(false);
    }
  };

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
      setBusinesses((prev) => {
        const updated = prev.filter((b) => b.id !== id);
        // adjust page if current page becomes empty
        const totalPages = Math.max(1, Math.ceil(updated.length / bizPageSize));
        if (bizPage > totalPages) setBizPage(totalPages);
        return updated;
      });
    } catch (error) {
      console.error('Error deleting business:', error);
      alert('Failed to delete business.');
    } finally {
      setDeletingId(null);
    }
  };

  const resetPopupState = () => {
    setViewingBiz(null);
    setEmployees([]);
    setEmployeesRequested(false);
    setEmpError(null);
    setLoadingEmployees(false);
    setProducts([]);
    setProductsRequested(false);
    setProdError(null);
    setLoadingProducts(false);
    setEditingEmployeeId(null);
    setEditingPositionId(null);
    setUpdatingEmployee(false);
    setRemovingEmployeeId(null);
    setDeletingProductId(null);
    setActiveTab(null);
    setEmployeeSearch('');
    setProductSearch('');
    setEmployeesPage(1);
    setProductsPage(1);
  };

  // Derived paginated businesses
  const filteredBusinesses = businesses.filter((b) => {
    const q = businessSearch.trim().toLowerCase();
    if (!q) return true;
    return (
      (b.name || '').toLowerCase().includes(q) ||
      (b.owner || '').toLowerCase().includes(q) ||
      String(b.code || '').toLowerCase().includes(q) ||
      (b.status || '').toLowerCase().includes(q)
    );
  });
  const totalBizPages = Math.max(1, Math.ceil(filteredBusinesses.length / bizPageSize));
  const paginatedBusinesses = filteredBusinesses.slice((bizPage - 1) * bizPageSize, bizPage * bizPageSize);

  // Derived filtered + paginated employees
  const filteredEmployees = employees.filter((e) => {
    const q = employeeSearch.trim().toLowerCase();
    if (!q) return true;
    return (e.username || '').toLowerCase().includes(q) ||
           ([e.first_name, e.last_name].filter(Boolean).join(' ') || '').toLowerCase().includes(q);
  });
  const totalEmployeesPages = Math.max(1, Math.ceil(filteredEmployees.length / employeesPageSize));
  const paginatedEmployees = filteredEmployees.slice((employeesPage - 1) * employeesPageSize, employeesPage * employeesPageSize);

  // Derived filtered + paginated products
  const filteredProducts = products.filter((p) => {
    const q = productSearch.trim().toLowerCase();
    if (!q) return true;
    return (p.name || '').toLowerCase().includes(q) || (p.category_name || '').toLowerCase().includes(q);
  });
  const totalProductsPages = Math.max(1, Math.ceil(filteredProducts.length / productsPageSize));
  const paginatedProducts = filteredProducts.slice((productsPage - 1) * productsPageSize, productsPage * productsPageSize);

  // Reset page when searches change
  useEffect(() => { setEmployeesPage(1); }, [employeeSearch]);
  useEffect(() => { setProductsPage(1); }, [productSearch]);

  useEffect(() => { setBizPage(1); }, [businessSearch]);

  return (
    <SuperAdminLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-2xl font-bold">Manage Businesses</h1>

          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="flex gap-2 flex-wrap">
              {['ACTIVE', 'OFFLINE', 'ALL'].map((status) => (
                <button
                  key={status}
                  onClick={() => { setFilter(status); setBizPage(1); }}
                  className={`px-3 py-2 rounded text-sm ${
                    filter === status
                      ? status === 'ACTIVE'
                        ? 'bg-green-500 text-white'
                        : status === 'OFFLINE'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 text-black'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {/* Removed Create Business button */}
          </div>
        </div>

        {/* Search (optional) */}
        <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <input
            type="text"
            placeholder="Search businesses... (name, owner, code, status)"
            value={businessSearch}
            onChange={(e) => setBusinessSearch(e.target.value)}
            className="w-full md:w-1/2 px-3 py-2 border rounded text-sm"
          />

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Per page:</label>
            <select
              value={bizPageSize}
              onChange={(e) => { setBizPageSize(Number(e.target.value)); setBizPage(1); }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>

        {/* Desktop table (md and up) */}
        <div className="hidden md:block">
          <table className="w-full table-auto border-collapse bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 text-left">
                <th className="p-3 text-sm">#</th>
                <th className="p-3 text-sm">Business Name</th>
                <th className="p-3 text-sm">Owner</th>
                <th className="p-3 text-sm">Code</th>
                <th className="p-3 text-sm">Status</th>
                <th className="p-3 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {paginatedBusinesses.map((biz, index) => (
                <tr key={biz.id} className="border-t">
                  <td className="p-3 text-sm">{(bizPage - 1) * bizPageSize + index + 1}</td>
                  <td className="p-3 text-sm">{biz.name}</td>
                  <td className="p-3 text-sm">{biz.owner}</td>
                  <td className="p-3 text-sm">{biz.code}</td>
                  <td className="p-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs font-semibold inline-block ${
                      biz.status === 'ACTIVE' ? 'bg-green-100 text-green-700 border border-green-300' :
                      biz.status === 'OFFLINE' ? 'bg-red-100 text-red-700 border border-red-300' :
                      'bg-gray-100 text-gray-600 border border-gray-300'
                    }`}>{biz.status}</span>
                  </td>
                  <td className="p-3 text-sm space-x-2">
                    <button
                      onClick={() => {
                        setViewingBiz(biz);
                        setEmployeesRequested(false);
                        setProductsRequested(false);
                        setEmployees([]);
                        setProducts([]);
                        setEmpError(null);
                        setProdError(null);
                        setActiveTab(null);
                        setEmployeeSearch('');
                        setProductSearch('');
                        setEmployeesPage(1);
                        setProductsPage(1);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
                    >
                      View
                    </button>
                  
                    <button
                      onClick={() => openEditPopup(biz)}
                      className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded text-sm"
                    >Edit</button>
                    
                    <button
                      onClick={() => handleDeleteBusiness(biz.id)}
                      disabled={deletingId === biz.id}
                      className={`px-3 py-1 rounded text-white text-sm ${
                        deletingId === biz.id ? 'bg-rose-300 cursor-not-allowed' : 'bg-rose-600 hover:bg-rose-700'
                      }`}
                    >
                      {deletingId === biz.id ? 'Deleting…' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <PaginationControls page={bizPage} totalPages={totalBizPages} setPage={setBizPage} />
        </div>

        {/* Mobile list (md:hidden) */}
        <div className="md:hidden">
          {paginatedBusinesses.length === 0 ? (
            <div className="text-center text-gray-500 py-8">No businesses found</div>
          ) : (
            paginatedBusinesses.map((biz, index) => (
              <MobileCard
                key={biz.id}
                biz={biz}
                index={(bizPage - 1) * bizPageSize + index}
                onView={(b) => {
                  setViewingBiz(b);
                  setEmployeesRequested(false);
                  setProductsRequested(false);
                  setEmployees([]);
                  setProducts([]);
                  setEmpError(null);
                  setProdError(null);
                  setActiveTab(null);
                  setEmployeeSearch('');
                  setProductSearch('');
                  setEmployeesPage(1);
                  setProductsPage(1);
                }}
                onEdit={(b) => {
                  // wire edit navigation if needed
                }}
                onDelete={handleDeleteBusiness}
                deletingId={deletingId}
              />
            ))
          )}

          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-600">Per page:</label>
              <select
                value={bizPageSize}
                onChange={(e) => { setBizPageSize(Number(e.target.value)); setBizPage(1); }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setBizPage(Math.max(1, bizPage - 1))}
                disabled={bizPage === 1}
                className="px-2 py-1 rounded border text-sm disabled:opacity-50"
              >
                Prev
              </button>
              <div className="text-sm text-gray-600">Page {bizPage} / {totalBizPages}</div>
              <button
                onClick={() => setBizPage(Math.min(totalBizPages, bizPage + 1))}
                disabled={bizPage === totalBizPages}
                className="px-2 py-1 rounded border text-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* AdminPopup for viewing business details */}
        {viewingBiz && (
          <AdminPopup
            isOpen={!!viewingBiz}
            title={viewingBiz.name}
            onClose={resetPopupState}
            maxWidth="max-w-4xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <button
                className={`px-3 py-1.5 rounded text-sm font-medium border transition ${activeTab === 'employees' ? 'bg-cyan-600 text-white border-cyan-600 shadow' : 'bg-white text-cyan-700 hover:bg-cyan-50 border-cyan-300'}`}
                onClick={() => {
                  if (activeTab === 'employees') return;
                  const load = async () => {
                    setActiveTab('employees');
                    setEmployeesRequested(true);
                    setProductsRequested(false);
                    setProducts([]);
                    setProdError(null);
                    setLoadingEmployees(true);
                    setEmpError(null);
                    setEmployees([]);
                    try {
                      const res = await axiosInstance.get(`/business/employees/${viewingBiz.id}`);
                      let dataPayload = [];
                      if (res?.data?.success) dataPayload = res.data.data || []; else if (Array.isArray(res?.data)) dataPayload = res.data;
                      setEmployees(Array.isArray(dataPayload) ? dataPayload : []);
                      setEmployeesPage(1);
                    } catch (e) { console.error('Failed to load employees', e); setEmpError('Failed to load employees'); }
                    finally { setLoadingEmployees(false); }
                  };
                  load();
                }}
              >Employees</button>

              <button
                className={`px-3 py-1.5 rounded text-sm font-medium border transition ${activeTab === 'products' ? 'bg-indigo-600 text-white border-indigo-600 shadow' : 'bg-white text-indigo-700 hover:bg-indigo-50 border-indigo-300'}`}
                onClick={() => {
                  if (activeTab === 'products') return;
                  const load = async () => {
                    setActiveTab('products');
                    setProductsRequested(true);
                    setEmployeesRequested(false);
                    setEmployees([]);
                    setEmpError(null);
                    setLoadingProducts(true);
                    setProdError(null);
                    setProducts([]);
                    try {
                      const res = await axiosInstance.get(`/inventory/businesses/${viewingBiz.id}/products`, { headers: { 'X-Business-ID': String(viewingBiz.id) } });
                      const dataPayload = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
                      setProducts(Array.isArray(dataPayload) ? dataPayload : []);
                      setProductsPage(1);
                    } catch (e) { console.error('Failed to load products', e); setProdError('Failed to load products'); }
                    finally { setLoadingProducts(false); }
                  };
                  load();
                }}
              >Products</button>

              {activeTab && (
                <button
                  className="ml-auto text-xs px-2 py-1 rounded border border-gray-300 text-gray-600 hover:bg-gray-100"
                  onClick={() => { setActiveTab(null); setEmployeesRequested(false); setProductsRequested(false); setEmployeeSearch(''); setProductSearch(''); setEmployeesPage(1); setProductsPage(1); }}
                >Clear</button>
              )}
            </div>

            {(employeesRequested || productsRequested) && (
              <div className="mt-4 border-t pt-4">
                <div>
                  {employeesRequested && activeTab === 'employees' && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Employees</h3>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <input
                          type="text"
                          value={employeeSearch}
                          onChange={(e) => setEmployeeSearch(e.target.value)}
                          placeholder="Search name or username..."
                          className="border rounded px-2 py-1 text-sm w-56"
                        />
                        <div className="flex items-center gap-2">
                          <label className="text-sm text-gray-600">Per page:</label>
                          <select
                            value={employeesPageSize}
                            onChange={(e) => { setEmployeesPageSize(Number(e.target.value)); setEmployeesPage(1); }}
                            className="border rounded px-2 py-1 text-sm"
                          >
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                          </select>
                        </div>
                        {loadingEmployees && <span className="text-xs text-gray-500">Loading…</span>}
                      </div>

                      {loadingEmployees && <div className="text-sm text-gray-600">Loading employees…</div>}
                      {empError && <div className="text-sm text-red-600">{empError}</div>}
                      {!loadingEmployees && !empError && employees.length === 0 && (
                        <div className="text-sm text-gray-600">No employees found.</div>
                      )}
                      {!loadingEmployees && !empError && employees.length > 0 && (
                        <div className="max-h-96 overflow-auto border rounded p-2">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="py-1 pr-2">User</th>
                                <th className="py-1 pr-2">Name</th>
                                <th className="py-1 pr-2">Contact</th>
                                <th className="py-1 pr-2">Position</th>
                                <th className="py-1 pr-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedEmployees.map((e) => (
                                <tr key={`${e.user_id}-${e.business_id}`} className="border-t ">
                                  <td className="py-1 pr-2">{e.username || '—'}</td>
                                  <td className="py-1 pr-2">{[e.first_name, e.last_name].filter(Boolean).join(' ') || '—'}</td>
                                  <td className="py-1 pr-2">{e.contact_no || '—'}</td>
                                  <td className="py-1 pr-2">
                                    {editingEmployeeId === e.user_id ? (
                                      <div className="flex items-center gap-1">
                                        <select
                                          className="border px-1 py-0.5 text-xs rounded dark:bg-gray-800"
                                          value={editingPositionId ?? ''}
                                          onChange={(ev) => setEditingPositionId(ev.target.value)}
                                          disabled={loadingPositions}
                                        >
                                          <option value="">Select</option>
                                          {positions.map(pos => (
                                            <option key={pos.bus_pos_id || pos.position_id || pos.id} value={pos.bus_pos_id || pos.position_id || pos.id}>
                                              {pos.name || pos.position_name || pos.title}
                                            </option>
                                          ))}
                                        </select>
                                        <button
                                          className="bg-green-600 text-white px-2 py-0.5 rounded text-xs disabled:opacity-50"
                                          disabled={!editingPositionId || updatingEmployee}
                                          onClick={async () => {
                                            if (!editingPositionId) return;
                                            try {
                                              setUpdatingEmployee(true);
                                              await axiosInstance.post('/business/assign-position', {
                                                user_id: e.user_id,
                                                business_id: viewingBiz.id,
                                                bus_pos_id: editingPositionId,
                                              });
                                              // Refresh employees
                                              const res = await axiosInstance.get(`/business/employees/${viewingBiz.id}`);
                                              let dataPayload = [];
                                              if (res?.data?.success) dataPayload = res.data.data || []; else if (Array.isArray(res?.data)) dataPayload = res.data;
                                              setEmployees(Array.isArray(dataPayload) ? dataPayload : []);
                                              setEditingEmployeeId(null);
                                              setEditingPositionId(null);
                                            } catch (err) {
                                              console.error('Failed to update position', err);
                                              alert('Update failed');
                                            } finally {
                                              setUpdatingEmployee(false);
                                            }
                                          }}
                                        >Save</button>
                                        <button
                                          className="bg-gray-400 text-white px-2 py-0.5 rounded text-xs"
                                          onClick={() => { setEditingEmployeeId(null); setEditingPositionId(null); }}
                                        >Cancel</button>
                                      </div>
                                    ) : (
                                      <span>{e.position_name || '—'}</span>
                                    )}
                                  </td>
                                  <td className="py-1 pr-2">
                                    {editingEmployeeId !== e.user_id && (
                                      <div className="flex gap-1">
                                        <button
                                          className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs"
                                          onClick={async () => { setEditingEmployeeId(e.user_id); setEditingPositionId(null); await fetchPositions(); }}
                                        >Edit</button>
                                        <button
                                          className="bg-red-600 text-white px-2 py-0.5 rounded text-xs disabled:opacity-50"
                                          disabled={removingEmployeeId === e.user_id}
                                          onClick={async () => {
                                            if (!window.confirm('Remove this employee from business?')) return;
                                            try {
                                              setRemovingEmployeeId(e.user_id);
                                              await axiosInstance.delete('/business/removeemployee', {
                                                data: { user_id: e.user_id, business_id: viewingBiz.id }
                                              });
                                              setEmployees(prev => prev.filter(emp => emp.user_id !== e.user_id));
                                            } catch (err) {
                                              console.error('Failed to remove employee', err);
                                              alert('Remove failed');
                                            } finally {
                                              setRemovingEmployeeId(null);
                                            }
                                          }}
                                        >{removingEmployeeId === e.user_id ? 'Removing…' : 'Remove'}</button>
                                      </div>
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <PaginationControls page={employeesPage} totalPages={totalEmployeesPages} setPage={setEmployeesPage} />
                        </div>
                      )}
                    </div>
                  )}

                  {productsRequested && activeTab === 'products' && (
                    <div>
                      <h3 className="text-md font-semibold mb-2">Products</h3>
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <input
                          type="text"
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Search product name..."
                          className="border rounded px-2 py-1 text-sm w-56"
                        />
                        <div className="flex items-center gap-2 ">
                          <label className="text-sm text-gray-600">Per page:</label>
                          <select
                            value={productsPageSize}
                            onChange={(e) => { setProductsPageSize(Number(e.target.value)); setProductsPage(1); }}
                            className="border rounded px-2 py-1 text-sm "
                          >
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                          </select>
                        </div>
                        {loadingProducts && <span className="text-xs text-gray-500">Loading…</span>}
                      </div>

                      {loadingProducts && <div className="text-sm text-gray-600">Loading products…</div>}
                      {prodError && <div className="text-sm text-red-600">{prodError}</div>}
                      {!loadingProducts && !prodError && products.length === 0 && (
                        <div className="text-sm text-gray-600">No products found.</div>
                      )}
                      {!loadingProducts && !prodError && products.length > 0 && (
                        <div className="max-h-96 overflow-auto border rounded p-2">
                          <table className="w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="py-1 pr-2">Name</th>
                                <th className="py-1 pr-2">Category</th>
                                <th className="py-1 pr-2">Price</th>
                                <th className="py-1 pr-2">Quantity</th>
                                <th className="py-1 pr-2">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginatedProducts.map((p) => (
                                <tr key={p.product_id} className="border-t">
                                  <td className="py-1 pr-2">{p.name || '—'}</td>
                                  <td className="py-1 pr-2">{p.category_name || '—'}</td>
                                  <td className="py-1 pr-2">{typeof p.price === 'number' ? p.price.toFixed(2) : (p.price ?? '—')}</td>
                                  <td className="py-1 pr-2">{p.quantity ?? '—'}</td>
                                  <td className="py-1 pr-2">
                                    <button
                                      className="bg-red-600 text-white px-2 py-0.5 rounded text-xs disabled:opacity-50"
                                      disabled={deletingProductId === p.product_id}
                                      onClick={async () => {
                                        if (!window.confirm('Delete this product? This cannot be undone.')) return;
                                        try {
                                          setDeletingProductId(p.product_id);
                                          await axiosInstance.delete(`/inventory/products/${p.product_id}` , {
                                            headers: { 'X-Business-ID': String(viewingBiz.id) }
                                          });
                                          setProducts(prev => prev.filter(prod => prod.product_id !== p.product_id));
                                        } catch (err) {
                                          console.error('Failed to delete product', err);
                                          alert('Delete failed');
                                        } finally {
                                          setDeletingProductId(null);
                                        }
                                      }}
                                    >{deletingProductId === p.product_id ? 'Deleting…' : 'Delete'}</button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>

                          <PaginationControls page={productsPage} totalPages={totalProductsPages} setPage={setProductsPage} />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </AdminPopup>
        )}

        {/* Edit Business Settings Popup */}
        {editOpen && (
          <AdminPopup
            isOpen={editOpen}
            title={`Edit: ${editBusinessName || ''}`}
            onClose={closeEditPopup}
            maxWidth="max-w-3xl"
          >
            <form onSubmit={handleEditSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white">Business Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900"
                  value={editBusinessName}
                  onChange={(e) => setEditBusinessName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Business Type</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-900"
                  value={editBusinessType}
                  onChange={(e) => setEditBusinessType(e.target.value)}
                  required
                >
                  <option value="">Select type</option>
                  {editLoadingCategories ? (
                    <option disabled>Loading...</option>
                  ) : (
                    editCategories.map((cat) => (
                      <option key={cat.business_cat_id} value={cat.business_cat_id}>
                        {cat.name}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white">Access Code</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm bg-gray-200 text-gray-800"
                  value={editAccessCode}
                  readOnly
                />
                <p className="text-xs text-gray-300 mt-1">
                  Share this code with employees to join the business.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">Upload Logo</label>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" id="edit-logo-upload" className="hidden" onChange={(e) => setEditLogo(e.target.files?.[0] || null)} />
                  <label htmlFor="edit-logo-upload" className="cursor-pointer bg-white px-3 py-2 rounded-md border border-gray-300 hover:bg-gray-100 text-sm text-gray-900">
                    {editLogo ? 'Change Logo' : 'Upload Logo'}
                  </label>
                  {editLogo && <span className="text-sm text-gray-300">{editLogo.name}</span>}
                </div>
                {editLogoPreview && (
                  <div className="mt-3">
                    <img src={editLogoPreview} alt="logo preview" className="h-16 w-16 object-contain rounded-md" />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={closeEditPopup} className="px-3 py-2 rounded border border-gray-400 text-sm text-white hover:bg-white/10">Cancel</button>
                <button type="submit" disabled={editSaving} className={`px-3 py-2 rounded text-sm text-white ${editSaving ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                  {editSaving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </form>
          </AdminPopup>
        )}
      </div>
    </SuperAdminLayout>
  );
};

export default BusinessManagement;
