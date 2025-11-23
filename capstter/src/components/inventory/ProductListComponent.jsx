import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const REFRESH_INTERVAL = 30000; // 30 seconds

const ProductListComponent = () => {
  const [products, setProducts] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});
  const [stockInputs, setStockInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchData = async () => {
    const token = getToken();
    const businessId = localStorage.getItem("selectedBusinessId");

    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }

    try {
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const [inventoryRes, unitsRes] = await Promise.all([
        fetch(`http://localhost:5000/api/inventory/products/active/inventory-details/${businessId}`, { headers }),
        fetch("http://localhost:5000/api/inventory/units", { headers }),
      ]);

      if (!inventoryRes.ok || !unitsRes.ok) {
        throw new Error("Failed to fetch data.");
      }

      const inventoryText = await inventoryRes.text();
      const inventoryData = inventoryText ? JSON.parse(inventoryText) : [];
      const unitsData = await unitsRes.json();

      const unitMap = {};
      unitsData.forEach(unit => {
        unitMap[unit.unit_id] = unit.name;
      });

      setProducts(inventoryData);
      setUnitsMap(unitMap);
    } catch (err) {
      console.error("❌ Error fetching inventory or units:", err);
      setError("Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddStock = async (productId) => {
    const quantity = parseInt(stockInputs[productId], 10);
    if (!quantity || quantity <= 0) {
      toast.error("Enter a valid quantity.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/inventory/inventory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) throw new Error("Failed to add stock");

      toast.success("Stock added successfully.");
      setStockInputs((prev) => ({ ...prev, [productId]: "" }));
      fetchData(); // refresh inventory
    } catch (err) {
      console.error("Error adding stock:", err);
      toast.error("Failed to add stock.");
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) return <p className="text-gray-600 text-base">Loading products...</p>;
  if (error) return <p className="text-gray-600 text-base">{error}</p>;

  return (
    <div className="p-4 font-sans">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">📦 Active Products with Inventory</h2>
      {products.length === 0 ? (
        <p className="text-gray-600 text-base">No active products found for this business.</p>
      ) : (
        <table className="w-full border-collapse text-sm shadow-md">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left border-b-2 border-gray-300">Product</th>
              <th className="p-3 text-left border-b-2 border-gray-300">Unit</th>
              <th className="p-3 text-left border-b-2 border-gray-300">Price</th>
              <th className="p-3 text-left border-b-2 border-gray-300">Quantity</th>
              <th className="p-3 text-left border-b-2 border-gray-300">Last Restocked</th>
              <th className="p-3 text-left border-b-2 border-gray-300">Image</th>
              <th className="p-3 text-left border-b-2 border-gray-300">Add Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr
                key={p.product_id}
                className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 border-b border-gray-200">{p.name}</td>
                <td className="p-3 border-b border-gray-200">{unitsMap[p.unit_id] || "—"}</td>
                <td className="p-3 border-b border-gray-200">₱{p.price}</td>
                <td className="p-3 border-b border-gray-200">{p.quantity ?? "—"}</td>
                <td className="p-3 border-b border-gray-200">
                  {p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}
                </td>
                <td className="p-3 border-b border-gray-200">
                  {p.picture ? (
                    <img
                      src={p.picture}
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td className="p-3 border-b border-gray-200">
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    className="w-16 mr-2 p-1 border rounded"
                    value={stockInputs[p.product_id] || ""}
                    onChange={(e) =>
                      setStockInputs((prev) => ({
                        ...prev,
                        [p.product_id]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleAddStock(p.product_id)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Add
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductListComponent;
