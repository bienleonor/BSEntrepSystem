import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getToken } from '../../utils/token';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

function ItemRegistration() {
  const [units, setUnits] = useState([]);
  const [showUnitDropdown, setShowUnitDropdown] = useState(false);
  const [itemData, setItemData] = useState({
    itemName: '',
    unit_id: '',
    unitSearch: '',
    productType: '',
    price: '',
    image: null,
  });

  const navigate = useNavigate();

  // 📦 Fetch Units
  useEffect(() => {
    const token = getToken();
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }

    fetch('http://localhost:5000/api/inventory/units', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(data => Array.isArray(data) ? setUnits(data) : setUnits([]))
      .catch(err => {
        console.error('Error fetching units:', err);
        setUnits([]);
      });
  }, [navigate]);

  // 🖊️ Input Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData(prev => ({ ...prev, [name]: value }));
  };

  // 🖼️ Image Upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setItemData(prev => ({ ...prev, image: file }));
  };

  // 🧹 Clear Form
  const handleClear = () => {
    setItemData({
      itemName: '',
      unit_id: '',
      unitSearch: '',
      productType: '',
      price: '',
      image: null,
    });
    setShowUnitDropdown(false);
  };

  // 🔄 Convert image to base64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

  // 🔄 Convert base64 to File
  const dataURLtoFile = (dataurl, filename) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  };

  // 📤 Send to backend
  const sendProductToServer = async (product, token) => {
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('unit_id', product.unit_id);
    formData.append('product_type', product.product_type);
    formData.append('price', product.price);
    formData.append('businessId', product.businessId);
    formData.append('picture', dataURLtoFile(product.image, 'offline-image.jpg'));

    try {
      const res = await fetch('http://localhost:5000/api/inventory/products', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save product');
      await res.json();
      toast.success('Product synced successfully!');
    } catch (error) {
      console.error('Error syncing product:', error);
      toast.error('Sync failed.');
    }
  };

  // 📤 Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken();
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected.");
      return;
    }

    const product = {
      name: itemData.itemName,
      unit_id: itemData.unit_id,
      product_type: itemData.productType,
      price: itemData.price,
      businessId,
      image: await toBase64(itemData.image),
    };

    if (!navigator.onLine) {
      const queue = JSON.parse(localStorage.getItem('offlineProducts') || '[]');
      queue.push(product);
      localStorage.setItem('offlineProducts', JSON.stringify(queue));
      toast.info('Saved locally. Will sync when online.');
      handleClear();
      return;
    }

    await sendProductToServer(product, token);
    handleClear();
  };

  // 🔄 Sync on reconnect
  useEffect(() => {
    const syncOfflineProducts = async () => {
      const token = getToken();
      const queue = JSON.parse(localStorage.getItem('offlineProducts') || '[]');
      for (const product of queue) {
        await sendProductToServer(product, token);
      }
      localStorage.removeItem('offlineProducts');
    };

    window.addEventListener('online', syncOfflineProducts);
    return () => window.removeEventListener('online', syncOfflineProducts);
  }, []);
  
  return (
    <DashboardLayout>
      <div className="flex justify-center items-center py-12 px-4">
        <div className="bg-bronze p-8 rounded-2xl w-full max-w-4xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
            REGISTER NEW ITEM
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10 items-start justify-center">
            {/* 📸 Image Upload */}
            <label className="w-64 h-64 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500 cursor-pointer relative rounded-lg overflow-hidden">
              {itemData.image ? (
                <img
                  src={URL.createObjectURL(itemData.image)}
                  alt="Preview"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm">PICTURE</span>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>

            {/* 📝 Input Fields */}
            <div className="flex flex-col gap-5 w-full max-w-sm">
              {/* Item Name */}
              <label className="block text-sm font-medium text-gray-700">
                Item Name
                <input
                  type="text"
                  name="itemName"
                  placeholder="ITEM NAME"
                  value={itemData.itemName}
                  onChange={handleChange}
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
                    itemData.unit_id
                      ? units.find(u => u.unit_id === itemData.unit_id)?.name || ''
                      : itemData.unitSearch
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setItemData(prev => ({ ...prev, unitSearch: value, unit_id: '' }));
                    setShowUnitDropdown(true);
                  }}
                  onBlur={() => setTimeout(() => setShowUnitDropdown(false), 100)}
                  className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoComplete="off"
                />
                {showUnitDropdown && itemData.unitSearch && (
                  <ul className="absolute z-10 bg-white border border-gray-300 rounded-md mt-1 w-full max-h-40 overflow-y-auto shadow-lg">
                    {units
                      .filter(unit => unit.name.toLowerCase().includes(itemData.unitSearch.toLowerCase()))
                      .map(unit => (
                        <li
                          key={unit.unit_id}
                          onMouseDown={() => {
                            setItemData(prev => ({
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
                  name="productType"
                  value={itemData.productType}
                  onChange={handleChange}
                  required
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
                  value={itemData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="mt-1 px-4 py-2 rounded-md border border-gray-300 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              {/* 🧵 Buttons */}
              <div className="flex gap-4 mt-6 justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition"
                >
                  CLEAR
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </DashboardLayout>
  );
}

export default ItemRegistration;
