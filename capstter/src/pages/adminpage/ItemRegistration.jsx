import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';

function ItemRegistration() {
  return (
    <DashboardLayout>
      <form className="max-w-2xl mx-auto mt-10 p-6 bg-blue-100 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 text-center">Register New Item</h1>

        {/* Product Name & Category */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
              <input
                type="text"
                name="productName"
                placeholder="Product Name"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
              <input
                type="text"
                name="category"
                placeholder="Category"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
        </div>

        {/* Price & Stock Quantity */}
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
              <input
                type="number"
                name="price"
                placeholder="Price"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stock Quantity
              <input
                type="number"
                name="quantity"
                placeholder="Stock Quantity"
                required
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </label>
          </div>
        </div>

        {/* Upload Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload Image
            <input
              type="file"
              name="productImage"
              accept="image/jpeg"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 bg-white"
            />
          </label>
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            SAVE
          </button>
          <button
            type="reset"
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            CLEAR FORM
          </button>
        </div>
      </form>
    </DashboardLayout>
  );
}

export default ItemRegistration;
