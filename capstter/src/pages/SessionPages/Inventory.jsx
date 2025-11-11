import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { getToken } from '../../utils/token';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function Inventory() {
  const [products, setProducts] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});
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
    </DashboardLayout>
  );
}

export default Inventory;
