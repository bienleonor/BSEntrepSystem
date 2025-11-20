import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Popup from '../../components/common/Popup';
import axiosInstance from '../../utils/axiosInstance'; // Import configured axios instance

function Inventory() {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});
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
  });
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const navigate = useNavigate();

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
      const [productsRes, unitsRes] = await Promise.all([
        axiosInstance.get(`/inventory/businesses/${businessId}/products`),
        axiosInstance.get('/inventory/units'),
      ]);

      // Build units map for easy lookup
      const unitMap = {};
      unitsRes.data.forEach(unit => {
        unitMap[unit.unit_id] = unit.name;
      });

      setUnits(unitsRes.data);
      setUnitsMap(unitMap);
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
    try {
      await axiosInstance.patch(`/inventory/products/${product.product_id}/status`, {
        is_active: !product.is_active
      });

      // Update local state
      setProducts(prev =>
        prev.map(p =>
          p.product_id === product.product_id 
            ? { ...p, is_active: !p.is_active } 
            : p
        )
      );

      toast.success("Status updated successfully.");
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
      toast.error(error.response?.data?.message || "Failed to delete product.");
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
    });
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

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading inventory...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Product List</h1>
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-100">
              <tr className="text-left text-sm text-gray-600">
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Price</th>
                <th className="px-4 py-2">Unit</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Created At</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.product_id} className="border-t text-sm text-gray-700 hover:bg-gray-50">
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.product_type}</td>
                  <td className="px-4 py-2">₱{product.price}</td>
                  <td className="px-4 py-2">{unitsMap[product.unit_id] || '—'}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleStatusToggle(product)}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {product.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-4 py-2">{new Date(product.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditOpen(product)}
                      className="text-sm text-green-600 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product.product_id, product.name)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-6 text-center text-gray-500">
                    No products found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      <Popup isOpen={isEditOpen} onClose={handleEditCancel} title="Modify Product">
        <form onSubmit={handleEditSubmit} className="flex flex-col md:flex-row gap-10 items-start justify-center">
          {/* Image Upload */}
          <label className="w-64 h-64 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer relative rounded-lg overflow-hidden">
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
              <span className="text-sm">PICTURE</span>
            )}
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleEditImageUpload} 
              className="hidden" 
            />
          </label>

          {/* Input Fields */}
          <div className="flex flex-col gap-5 w-full max-w-sm">
            {/* Name */}
            <label className="block text-sm font-medium text-gray-700">
              Item Name
              <input
                type="text"
                name="name"
                placeholder="ITEM NAME"
                value={editForm.name}
                onChange={handleEditChange}
                required
                className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Unit Search Dropdown */}
            <label className="block text-sm font-medium text-gray-700 relative">
              Unit
              <input
                type="text"
                name="unitSearch"
                placeholder="SEARCH UNIT"
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
                className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoComplete="off"
              />
              {showUnitDropdown && (editForm.unitSearch || editForm.unit_id === '') && (
                <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
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
                        className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                      >
                        {unit.name}
                      </li>
                    ))}
                </ul>
              )}
            </label>

            {/* Product Type */}
            <label className="block text-sm font-medium text-gray-700">
              Product Type
              <select
                name="product_type"
                value={editForm.product_type}
                onChange={handleEditChange}
                className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Product Type</option>
                <option value="simple">Simple</option>
                <option value="composite">Composite</option>
              </select>
            </label>

            {/* Price */}
            <label className="block text-sm font-medium text-gray-700">
              Price
              <input
                type="number"
                name="price"
                placeholder="PRICE"
                value={editForm.price}
                onChange={handleEditChange}
                required
                min="0"
                step="0.01"
                className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </label>

            {/* Buttons */}
            <div className="flex gap-4 mt-6 justify-center">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
              >
                SAVE
              </button>
              <button
                type="button"
                onClick={handleEditCancel}
                className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition"
              >
                CANCEL
              </button>
            </div>
          </div>
        </form>
      </Popup>
    </DashboardLayout>
  );
}

export default Inventory;