import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '../../utils/axiosInstance.js';

// CategoryWrapper lists product categories for a business and allows creating new ones.
// It attempts to derive businessId from (in order): props, route params, auth context, localStorage.
const CategoryWrapper = ({ businessId: propBusinessId }) => {
  // Business ID comes from localStorage as per app convention
  const businessId = localStorage.getItem('selectedBusinessId') || '';

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (!businessId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/inventory/${businessId}/product-categories`);
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  }, [businessId]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!businessId) {
      setCreateError('Business ID unavailable');
      return;
    }
    if (!name.trim()) {
      setCreateError('Name is required');
      return;
    }
    setCreating(true);
    setCreateError(null);
    try {
      const payload = { name: name.trim(), description: description.trim(), businessId };
      // Correct endpoint under /api/inventory
      const res = await axiosInstance.post(`/inventory/product-categories`, payload);
      // Optimistically add new category shell (backend returns insertId)
      const newCategory = {
        category_id: res.data?.categoryId,
        name: payload.name,
        description: payload.description,
        business_id: businessId,
        is_active: 1,
        created_at: new Date().toISOString(),
      };
      setCategories((prev) => [newCategory, ...prev]);
      setName('');
      setDescription('');
    } catch (err) {
      setCreateError(err?.response?.data?.message || err.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const handleRefresh = () => setRefreshIndex((i) => i + 1);

  // Simple client-side search
  const [search, setSearch] = useState('');
  const filtered = categories.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.description?.toLowerCase().includes(q) ||
      String(c.category_id).includes(q)
    );
  });

  const countLabel = filtered.length === categories.length
    ? `${categories.length} total`
    : `${filtered.length} of ${categories.length}`;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-600/90 to-indigo-700 px-5 py-4 text-white shadow-lg">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Product Categories</h2>
          <p className="text-sm text-indigo-100">Manage and search your categories for the selected business.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-indigo-500/30 px-3 py-1 text-sm">{countLabel}</span>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className={`rounded-md bg-white/10 px-3 py-2 text-sm font-medium backdrop-blur hover:bg-white/20 ${
              loading ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {!businessId && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Business ID not found. Provide it via props, route, context, or localStorage.
        </div>
      )}

      {/* Content grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Create form */}
        <form
          onSubmit={handleSubmit}
          className="md:col-span-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
        >
          <h3 className="mb-3 text-lg font-semibold text-gray-900">New Category</h3>

          <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            required
            disabled={creating}
            className="mb-3 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description"
            rows={3}
            disabled={creating}
            className="mb-4 w-full resize-y rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={creating || !businessId}
            className={`inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 ${
              creating || !businessId ? 'cursor-not-allowed opacity-60' : ''
            }`}
          >
            {creating ? 'Creating…' : 'Create Category'}
          </button>

          {createError && (
            <div className="mt-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {createError}
            </div>
          )}
        </form>

        {/* List + search */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, description, or ID…"
                disabled={loading}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 pl-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>
            <span className="hidden text-sm text-gray-600 md:block">{countLabel}</span>
          </div>

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-gray-700">
                <tr>
                  <th className="px-4 py-2 font-medium">ID</th>
                  <th className="px-4 py-2 font-medium">Name</th>
                  <th className="px-4 py-2 font-medium">Description</th>
                </tr>
              </thead>
              <tbody>
                {loading && filtered.length === 0 && (
                  <>
                    <tr className="border-t border-gray-100">
                      <td colSpan={3} className="px-4 py-6">
                        <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-slate-200" />
                      </td>
                    </tr>
                    <tr className="border-t border-gray-100">
                      <td colSpan={3} className="px-4 py-6">
                        <div className="h-4 w-1/4 animate-pulse rounded bg-slate-200" />
                        <div className="mt-2 h-3 w-3/5 animate-pulse rounded bg-slate-200" />
                      </td>
                    </tr>
                  </>
                )}

                {!loading && filtered.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-sm">
                      <div className="mx-auto max-w-md">
                        <p className="text-gray-600">No categories found.</p>
                        <p className="mt-1 text-gray-500">
                          Try adjusting your search or create a new category.
                        </p>
                        <button
                          onClick={handleRefresh}
                          className="mt-3 inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800"
                        >
                          Refresh
                        </button>
                      </div>
                    </td>
                  </tr>
                )}

                {filtered.map((c) => (
                  <tr key={c.category_id} className="border-t border-gray-100 hover:bg-slate-50">
                    <td className="px-4 py-2 text-gray-700">{c.category_id}</td>
                    <td className="px-4 py-2 text-gray-900">{c.name}</td>
                    <td className="px-4 py-2 text-slate-700">{c.description || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className={`rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 ${
                loading ? 'cursor-not-allowed opacity-60' : ''
              }`}
            >
              {loading ? 'Refreshing…' : 'Reload list'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryWrapper;
