//Product list
import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Popup from '../../components/common/Popup';
import RecipeBuilder from './RecipeBuilder';
import axiosInstance from '../../utils/axiosInstance'; // Import configured axios instance

function ProductList() {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});
  const [categories, setCategories] = useState([]);
  const [categoriesMap, setCategoriesMap] = useState({});
  const [loading, setLoading] = useState(true);
  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    unit_id: '',
    unitSearch: '',
    product_type: '',
    price: '',
    imageFile: null,
    picture: '',
    category_id: '',
  });
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const navigate = useNavigate();

  // Helper function to check if product is active (handles 1/0/"1"/"0"/true/false)
  const isProductActive = (product) => {
    return product.is_active === 1 || product.is_active === "1" || product.is_active === true;
  };

  useEffect(() => {
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }

    fetchData(businessId);
  }, [navigate]);

  // Fetch products and units
  const fetchData = async (businessId) => {
      try {
        setLoading(true);

        // Parallel requests using Promise.all
        const [productsRes, unitsRes, categoriesRes] = await Promise.all([
          axiosInstance.get(`/inventory/businesses/${businessId}/products`),
          axiosInstance.get('/inventory/units'),
          axiosInstance.get(`/inventory/${businessId}/product-categories`),
        ]);

        // Build units map for easy lookup
        const unitMap = {};
        unitsRes.data.forEach(unit => {
          unitMap[unit.unit_id] = unit.name;
        });

        setUnits(unitsRes.data);
        setUnitsMap(unitMap);
        const catMap = {};
        (categoriesRes.data || []).forEach(cat => {
          catMap[cat.category_id] = cat.name;
        });
        setCategories(categoriesRes.data || []);
        setCategoriesMap(catMap);
        setProducts(productsRes.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error(error.response?.data?.message || "Error loading inventory.");
      } finally {
        setLoading(false);
      }
    };

  // Toggle product active status
  const handleStatusToggle = async (product) => {
    const currentlyActive = isProductActive(product);
    const newStatus = !currentlyActive;
    
    try {
      await axiosInstance.patch(`/inventory/products/${product.product_id}/status`, {
        is_active: newStatus
      });

      // Update local state with consistent 1/0 values
      setProducts(prev =>
        prev.map(p =>
          p.product_id === product.product_id 
            ? { ...p, is_active: newStatus ? 1 : 0 } 
            : p
        )
      );

      toast.success(`Product ${newStatus ? 'activated' : 'deactivated'} successfully.`);
    } catch (error) {
      console.error("Status update failed:", error);
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  // Delete product
  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(`Delete "${productName}" permanently?`);
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/inventory/products/${productId}`);

      // Remove from local state
      setProducts(prev => prev.filter(p => p.product_id !== productId));
      toast.success("Product deleted successfully.");
    } catch (error) {
      console.error("Delete failed:", error);
      // Provide a user-friendly message for FK constraint issues
      const rawMsg = error.response?.data?.message || error.message || '';
      let friendly = 'Failed to delete product.';
      if (/Cannot delete or update a parent row/i.test(rawMsg)) {
        friendly = 'Cannot delete: product is referenced by existing transactions (purchases, inventory, production, or recipes). Consider deactivating instead.';
      } else if (/FOREIGN KEY|fk_/i.test(rawMsg)) {
        friendly = 'Delete blocked by related records. Remove dependent data first or use deactivate.';
      }
      toast.error(friendly);
    }
  };

  // Open edit modal
  const handleEditOpen = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      unit_id: product.unit_id || '',
      unitSearch: '',
      product_type: product.product_type || '',
      price: product.price || '',
      imageFile: null,
      picture: product.picture || '',
      category_id: product.category_id || '',
    });
    // If product has recipe/composite type, fetch its ingredients from backend
    const loadRecipe = async () => {
      try {
        if (product.product_type === 'recipe') {
          const res = await axiosInstance.get(`/inventory/recipes/${product.product_id}`);
          const ingredients = Array.isArray(res.data)
            ? res.data.map(r => ({
                recipe_id: r.recipe_id,
                ingredient_product_id: r.ingredient_product_id,
                consumption_amount: r.consumption_amount,
                ingredient_name: r.ingredient_name || r.name || ''
              }))
            : [];
          setRecipeIngredients(ingredients);
        } else if (product.product_type === 'composite') {
          const res = await axiosInstance.get(`/inventory/combo/${product.product_id}`);
          const items = Array.isArray(res.data)
            ? res.data.map(r => ({
                component_id: r.component_id,
                component_product_id: r.component_product_id,
                quantity: r.quantity,
                component_name: r.component_name,
                product_type: r.product_type,
              }))
            : [];
          setRecipeIngredients(items);
        } else {
          setRecipeIngredients(product.recipe || []);
        }
      } catch (err) {
        console.error('Failed to load recipe ingredients:', err);
        toast.error('Failed to load recipe ingredients.');
        setRecipeIngredients(product.recipe || []);
      }
    };

    loadRecipe();
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditImageUpload = (e) => {
    const file = e.target.files[0];
    setEditForm(prev => ({ ...prev, imageFile: file }));
  };

  const handleEditCancel = () => {
    setIsEditOpen(false);
    setEditProduct(null);
    setShowUnitDropdown(false);
  };

  // Submit edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editProduct) return;

    const businessId = localStorage.getItem("selectedBusinessId");
    if (!businessId) {
      toast.error("No business selected.");
      return;
    }

    try {
      // Client-side validation
      if (!editForm.name || !editForm.unit_id || editForm.price === '') {
        toast.error("Please complete all required fields.");
        return;
      }
      if (isNaN(Number(editForm.price)) || Number(editForm.price) < 0) {
        toast.error("Price must be a non-negative number.");
        return;
      }

      let response;

      // If new image file selected => send multipart/form-data
      if (editForm.imageFile) {
        const formData = new FormData();
        formData.append('name', editForm.name);
        formData.append('businessId', businessId);
        formData.append('unit_id', editForm.unit_id);
        formData.append('price', editForm.price);
        formData.append('product_type', editForm.product_type || '');
        formData.append('picture', editForm.imageFile);
        formData.append('recipe', JSON.stringify(recipeIngredients || []));
        if (editForm.category_id) formData.append('category_id', editForm.category_id);

        response = await axiosInstance.put(
          `/inventory/products/${editProduct.product_id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
      } else {
        // No new file => send JSON with existing picture
        const payload = {
          name: editForm.name,
          businessId,
          unit_id: editForm.unit_id,
          price: editForm.price,
          picture: editForm.picture || '',
          product_type: editForm.product_type || '',
          recipe: recipeIngredients || [],
          category_id: editForm.category_id || '',
        };

        response = await axiosInstance.put(
          `/inventory/products/${editProduct.product_id}`,
          payload
        );
      }

      // Update local state
      setProducts(prev =>
        prev.map(p =>
          p.product_id === editProduct.product_id
            ? {
                ...p,
                name: editForm.name,
                unit_id: editForm.unit_id,
                product_type: editForm.product_type,
                price: editForm.price,
                picture: editForm.imageFile 
                  ? URL.createObjectURL(editForm.imageFile) 
                  : editForm.picture,
                category_id: editForm.category_id || p.category_id,
              }
            : p
        )
      );

      toast.success("Product updated successfully.");
      handleEditCancel();
    } catch (error) {
      console.error("Update failed:", error);
      toast.error(error.response?.data?.error || error.response?.data?.message || "Failed to update product.");
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'simple': return { bg: 'bg-gray-100', color: 'text-gray-700' };
      case 'recipe': return { bg: 'bg-purple-100', color: 'text-purple-600' };
      case 'composite': return { bg: 'bg-cyan-100', color: 'text-cyan-600' };
      default: return { bg: 'bg-gray-100', color: 'text-gray-600' };
    }
  };

  const getStockStatus = (qty) => {
    if (qty === null || qty === undefined) return { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Unknown' };
    if (qty <= 0) return { color: 'text-red-600', bg: 'bg-red-100', label: 'Out of Stock' };
    if (qty <= 10) return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', label: 'In Stock' };
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-black/30 border-t-black mx-auto"></div>
            <p className="mt-4 text-black/70 font-medium">Loading inventory...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black/90 tracking-tight">
            Product List
          </h1>
          <p className="mt-2 text-black/60 text-sm sm:text-base">
            Manage your products, recipes, and composites
          </p>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-gray-100 backdrop-blur-sm rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-xs uppercase tracking-wider">Total Products</p>
            <p className="text-2xl font-bold text-black mt-1">{products.length}</p>
          </div>
          <div className="bg-gray-100 backdrop-blur-sm rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-xs uppercase tracking-wider">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {products.filter(p => isProductActive(p)).length}
            </p>
          </div>
          <div className="bg-gray-100 backdrop-blur-sm rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-xs uppercase tracking-wider">Inactive</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">
              {products.filter(p => !isProductActive(p)).length}
            </p>
          </div>
          <div className="bg-gray-100 backdrop-blur-sm rounded-xl p-4 border border-gray-300">
            <p className="text-gray-600 text-xs uppercase tracking-wider">Low Stock</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {products.filter(p => (p.total_quantity ?? 0) > 0 && (p.total_quantity ?? 0) <= 10).length}
            </p>
          </div>
        </div>

        {/* Mobile: Card Grid */}
        <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
          {products.map((product) => {
            const typeStyle = getTypeStyle(product.product_type);
            const stockStatus = getStockStatus(product.total_quantity);
            return (
              <div key={product.product_id} className="group bg-white backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-300 hover:border-gray-400 transition-all">
                {/* Image Section */}
                <div className="relative h-36 bg-gray-200 overflow-hidden">
                  {product.picture ? (
                    <img src={product.picture} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent" />
                  {/* Status Badge */}
                  <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full ${isProductActive(product) ? 'bg-green-100' : 'bg-gray-200'}`}>
                    <span className={`text-xs font-medium ${isProductActive(product) ? 'text-green-600' : 'text-gray-600'}`}>
                      {isProductActive(product) ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {/* Type Badge */}
                  <div className={`absolute top-3 right-3 ${typeStyle.bg} backdrop-blur-sm px-2.5 py-1 rounded-full`}>
                    <span className={`text-xs font-medium capitalize ${typeStyle.color}`}>{product.product_type || '—'}</span>
                  </div>
                  {/* Price Badge */}
                  <div className="absolute bottom-3 right-3 bg-gray-800/70 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-white font-bold">₱{Number(product.price).toFixed(2)}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-4">
                  <h3 className="font-semibold text-black truncate mb-2">{product.name}</h3>
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Category:</span>
                      <span className="text-gray-700">{product.category_name || categoriesMap[product.category_id] || '—'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Qty:</span>
                      <span className={`font-medium ${stockStatus.color}`}>{product.total_quantity ?? 0} {unitsMap[product.unit_id] || ''}</span>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-300">
                    <button
                      onClick={() => handleStatusToggle(product)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${isProductActive(product) ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-100 hover:bg-green-200 text-green-600'}`}
                    >
                      {isProductActive(product) ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEditOpen(product)}
                      className="flex-1 px-3 py-2 rounded-lg text-xs font-medium bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id, product.name)}
                      className="px-3 py-2 rounded-lg text-xs font-medium bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {products.length === 0 && (
            <div className="col-span-full bg-white backdrop-blur-sm rounded-2xl border border-gray-300 p-12 text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-800 mb-1">No products found</h3>
              <p className="text-gray-500 text-sm">Add products to see them here</p>
            </div>
          )}
        </div>

        {/* Desktop: Table */}
        <div className="hidden md:block bg-white backdrop-blur-sm rounded-2xl border border-gray-300 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {products.map((product) => {
                  const typeStyle = getTypeStyle(product.product_type);
                  const stockStatus = getStockStatus(product.total_quantity);
                  return (
                    <tr key={product.product_id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                            {product.picture ? (
                              <img src={product.picture} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                              </div>
                            )}
                          </div>
                          <span className="font-medium text-black">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${typeStyle.bg} ${typeStyle.color}`}>
                          {product.product_type || '—'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-semibold text-black">₱{Number(product.price).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{product.category_name || categoriesMap[product.category_id] || '—'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${stockStatus.color}`}>{product.total_quantity ?? 0}</span>
                          <span className="text-gray-500 text-sm">{unitsMap[product.unit_id] || ''}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleStatusToggle(product)}
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${isProductActive(product) ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                        >
                          {isProductActive(product) ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-gray-500 text-sm">
                        {new Date(product.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleEditOpen(product)}
                            className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition-all"
                            title="Edit"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product.product_id, product.name)}
                            className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-600 transition-all"
                            title="Delete"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="8" className="px-6 py-12 text-center">
                      <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                        <svg className="w-7 h-7 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      </div>
                      <h3 className="text-base font-medium text-gray-800 mb-1">No products found</h3>
                      <p className="text-gray-500 text-sm">Add products to see them here</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Popup isOpen={isEditOpen} onClose={handleEditCancel} title="Modify Product" >
        <form onSubmit={handleEditSubmit} className="flex flex-col md:flex-row gap-6 md:gap-10 items-start justify-center">
          {/* Image Upload */}
          <label className="w-40 h-40 md:w-64 md:h-64 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-600 cursor-pointer relative rounded-xl overflow-hidden bg-gray-100 hover:border-gray-500 transition-colors">
            {editForm.imageFile ? (
              <img
                src={URL.createObjectURL(editForm.imageFile)}
                alt="Preview"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : editForm.picture ? (
              <img
                src={editForm.picture}
                alt="Current"
                className="absolute inset-0 w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Click to upload</span>
              </div>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleEditImageUpload} 
              className="hidden" 
            />
          </label>

          {/* Input Fields */}
          <div className="flex flex-col gap-4 w-full max-w-sm">
            {/* Name */}
            <label className="block text-sm font-medium text-gray-700">
              Item Name
              <input
                type="text"
                name="name"
                placeholder="Enter item name"
                value={editForm.name}
                onChange={handleEditChange}
                required
                className="mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-black placeholder-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </label>

            {/* Unit Search Dropdown */}
            <label className="block text-sm font-medium text-gray-700 relative">
              Unit
              <input
                type="text"
                name="unitSearch"
                placeholder="Search unit"
                value={
                  editForm.unit_id
                    ? units.find(u => u.unit_id === editForm.unit_id)?.name || ''
                    : editForm.unitSearch
                }
                onChange={(e) => {
                  const value = e.target.value;
                  setEditForm(prev => ({ ...prev, unitSearch: value, unit_id: '' }));
                  setShowUnitDropdown(true);
                }}
                onBlur={() => setTimeout(() => setShowUnitDropdown(false), 100)}
                className="mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-black placeholder-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                autoComplete="off"
              />
              {showUnitDropdown && (editForm.unitSearch || editForm.unit_id === '') && (
                <ul className="absolute z-10 bg-gray-100 border border-gray-300 rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                  {units
                    .filter(unit =>
                      unit.name.toLowerCase().includes((editForm.unitSearch || '').toLowerCase())
                    )
                    .map(unit => (
                      <li
                        key={unit.unit_id}
                        onMouseDown={() => {
                          setEditForm(prev => ({
                            ...prev,
                            unit_id: unit.unit_id,
                            unitSearch: unit.name,
                          }));
                          setShowUnitDropdown(false);
                        }}
                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer text-gray-800"
                      >
                        {unit.name}
                      </li>
                    ))}
                </ul>
              )}
            </label>

            {/* Category */}
            <label className="block text-sm font-medium text-gray-700">
              Category
              <select
                name="category_id"
                value={editForm.category_id}
                onChange={handleEditChange}
                className="mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                disabled={!categories.length}
                required
              >
                <option value="" className="bg-gray-100">{categories.length ? 'Select Category' : 'No categories available'}</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id} className="bg-gray-100">
                    {cat.name}
                  </option>
                ))}
              </select>
            </label>

            {/* Product Type */}
            <label className="block text-sm font-medium text-gray-700">
              Product Type
              <select
                name="product_type"
                value={editForm.product_type}
                onChange={handleEditChange}
                className="mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-black w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              >
                <option value="" className="bg-gray-100">Select Product Type</option>
                <option value="simple" className="bg-gray-100">Simple</option>
                <option value="recipe" className="bg-gray-100">Recipe</option>
                <option value="composite" className="bg-gray-100">Composite</option>
              </select>
            </label>

            {/* Price */}
            <label className="block text-sm font-medium text-gray-700">
              Price
              <input
                type="number"
                name="price"
                placeholder="Enter price"
                value={editForm.price}
                onChange={handleEditChange}
                required
                min="0"
                step="0.01"
                className="mt-1 px-4 py-2.5 rounded-lg border border-gray-300 bg-gray-100 text-black placeholder-gray-500 w-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
              />
            </label>

             {/* RECIPE BUILDER */}
          {(editForm.product_type === "recipe" ||
            editForm.product_type === "composite") && (
            <div className="w-full flex justify-center animate-fadeIn mt-4">
              <RecipeBuilder
                productType={editForm.product_type}
                onRecipeChange={setRecipeIngredients}
                initialRecipe={recipeIngredients}
              />
            </div>
          )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-6 justify-center w-full">
              <button
                type="submit"
                className="w-full sm:w-auto bg-blue-100 hover:bg-blue-200 text-blue-600 border border-blue-300 px-6 py-2.5 rounded-lg font-medium transition-all"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 text-gray-700 border border-gray-300 px-6 py-2.5 rounded-lg font-medium transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
         
        </form>
      </Popup>
    </DashboardLayout>
  );
}

export default ProductList;