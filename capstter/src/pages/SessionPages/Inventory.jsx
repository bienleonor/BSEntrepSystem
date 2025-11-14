import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getToken } from '../../utils/token';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Popup from '../../components/common/Popup';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);           // keep full units for dropdown
  const [unitsMap, setUnitsMap] = useState({});
  

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    unit_id: '',
    unitSearch: '',
    product_type: '',
    price: '',
    imageFile: null,    // local file for preview/upload
    picture: '',        // existing / new picture URL/base64 to send
  });
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = getToken();
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }

    const fetchData = async () => {
      try {
        const [productsRes, unitsRes] = await Promise.all([
          fetch(`http://localhost:5000/api/inventory/businesses/${businessId}/products`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:5000/api/inventory/units`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!productsRes.ok || !unitsRes.ok) {
          throw new Error("Failed to fetch data.");
        }

        const productsData = await productsRes.json();
        const unitsData = await unitsRes.json();

        const unitMap = {};
        unitsData.forEach(unit => {
          unitMap[unit.unit_id] = unit.name;
        });

        setUnits(unitsData);
        setUnitsMap(unitMap);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        toast.error("Error loading inventory.");
      }
    };

    fetchData();
  }, [navigate]);

  const handleStatusToggle = async (product) => {
    try {
      const response = await fetch(`http://localhost:5000/api/inventory/products/${product.product_id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ is_active: !product.is_active }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setProducts(prev =>
        prev.map(p =>
          p.product_id === product.product_id ? { ...p, is_active: !p.is_active } : p
        )
      );
      toast.success("Status updated.");
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (productId, productName) => {
    const confirmDelete = window.confirm(`Delete "${productName}" permanently?`);
    if (!confirmDelete) return;

    try {
      const response = await fetch(`http://localhost:5000/api/inventory/products/${productId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      if (!response.ok) throw new Error("Failed to delete product");

      setProducts(prev => prev.filter(p => p.product_id !== productId));
      toast.success("Product deleted.");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete product.");
    }
  };

  // Helpers
  const toBase64 = (file) => new Promise((resolve, reject) => {
    if (!file) return resolve(null);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // Open edit modal with product data
  const handleEditOpen = (product) => {
    setEditProduct(product);
    setEditForm({
      name: product.name || '',
      unit_id: product.unit_id || '',
      unitSearch: '',
      product_type: product.product_type || '',
      price: product.price || '',
      imageFile: null,
      picture: product.picture || '', // preserve existing picture
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

  const handleEditSubmit = async (e) => {
  e.preventDefault();
  if (!editProduct) return;

  const token = getToken();
  const businessId = localStorage.getItem("selectedBusinessId");
  if (!businessId) {
    toast.error("No business selected.");
    return;
  }

  try {
    // Basic client-side validation
    if (!editForm.name || !editForm.unit_id || editForm.price === '') {
      toast.error("Please complete all required fields.");
      return;
    }
    if (isNaN(Number(editForm.price)) || Number(editForm.price) < 0) {
      toast.error("Price must be a non-negative number.");
      return;
    }

    let res;

    // If a new file selected => send multipart/form-data
    if (editForm.imageFile) {
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('businessId', businessId);
      formData.append('unit_id', editForm.unit_id);
      formData.append('price', editForm.price);
      formData.append('product_type', editForm.product_type || '');
      formData.append('picture', editForm.imageFile); // must match multer upload.single('picture')

      res = await fetch(`http://localhost:5000/api/inventory/products/${editProduct.product_id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`, // don't set Content-Type
        },
        body: formData,
      });
    } else {
      // No new file => preserve existing picture string and send JSON
      const payload = {
        name: editForm.name,
        businessId,
        unit_id: editForm.unit_id,
        price: editForm.price,
        picture: editForm.picture || '', // existing URL/string
        product_type: editForm.product_type || '',
      };

      res = await fetch(`http://localhost:5000/api/inventory/products/${editProduct.product_id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
    }

    if (!res || !res.ok) {
      // Try to surface server error message when available
      let errText = 'Failed to update product';
      try {
        const errBody = await res.json();
        if (errBody && errBody.error) errText = errBody.error;
      } catch (_) {}
      throw new Error(errText);
    }

    // Update local list (use picture preview if new file chosen)
    setProducts(prev =>
      prev.map(p =>
        p.product_id === editProduct.product_id
          ? {
              ...p,
              name: editForm.name,
              unit_id: editForm.unit_id,
              product_type: editForm.product_type,
              price: editForm.price,
              picture: editForm.imageFile ? URL.createObjectURL(editForm.imageFile) : editForm.picture,
            }
          : p
      )
    );

    toast.success("Product updated successfully.");
    handleEditCancel();
  } catch (error) {
    console.error("Update failed:", error);
    toast.error(error.message || "Failed to update product.");
  }
};


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
                      {product.is_active ? 'Active' : 'Deactivate'}
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
           {/* Edit Modal using reusable Popup */}
      <Popup isOpen={isEditOpen} onClose={handleEditCancel} title="Modify Product">
        <form onSubmit={handleEditSubmit} className="flex flex-col md:flex-row gap-10 items-start justify-center">
          {/* 📸 Image Upload */}
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
            {/* NOTE: input must be inside label so clicking preview opens picker */}
            <input type="file" accept="image/*" onChange={handleEditImageUpload} className="hidden" />
          </label>

          {/* 📝 Input Fields */}
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

            {/* 🔍 Unit Search Dropdown */}
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
