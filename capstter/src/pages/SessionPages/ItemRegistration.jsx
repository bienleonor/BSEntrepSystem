import React, { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

function ItemRegistration() {
  const [itemData, setItemData] = useState({
    itemName: '',
    unit: '',
    productType: '',
    price: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItemData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setItemData((prev) => ({ ...prev, image: file }));
  };

  const handleClear = () => {
    setItemData({
      itemName: '',
      unit: '',
      productType: '',
      price: '',
      image: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting:', itemData);
    // TODO: Add API call or toast feedback
  };

  return (
    <DashboardLayout>
      <div className="flex justify-center items-center py-12 px-4">
        <div className="bg-bronze p-8 rounded-2xl w-full max-w-4xl shadow-lg">
          <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">REGISTER NEW ITEM</h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col md:flex-row gap-10 items-start justify-center"
          >
            {/* Image Upload Section */}
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
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>

            {/* Input Fields */}
            <div className="flex flex-col gap-5 w-full max-w-sm">
              <input
                type="text"
                name="itemName"
                placeholder="ITEM NAME"
                value={itemData.itemName}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="unit"
                placeholder="UNIT"
                value={itemData.unit}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="productType"
                placeholder="PRODUCT TYPE"
                value={itemData.productType}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                name="price"
                placeholder="PRICE"
                value={itemData.price}
                onChange={handleChange}
                required
                className="px-4 py-2 rounded-md border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

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
    </DashboardLayout>
  );
}

export default ItemRegistration;
