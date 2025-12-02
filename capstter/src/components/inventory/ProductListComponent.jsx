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
      unitsData.forEach((unit) => {
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

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [navigate]);

  if (loading) return <p className="text-gray-600 text-base">Loading products...</p>;
  if (error) return <p className="text-gray-600 text-base">{error}</p>;

  return (
    <div className="p-3 sm:p-4 font-sans">
      <h2 className="mb-4 text-lg sm:text-xl font-semibold text-gray-800">📦 Active Products with Inventory</h2>
      {products.length === 0 ? (
        <p className="text-gray-600 text-base">No active products found for this business.</p>
      ) : (
        <>
          {/* Mobile: Card list */}
          <div className="md:hidden space-y-3">
            {products.map((p) => (
              <div key={p.product_id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="flex-shrink-0">
                  {p.picture ? (
                    <img src={p.picture} alt={p.name} className="w-16 h-16 object-cover rounded" loading="lazy" />
                  ) : (
                    <div className="w-16 h-16 bg-gray-100 rounded grid place-items-center text-gray-400 text-xs">No image</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{p.name}</div>
                  <div className="text-xs text-gray-600">Unit: {unitsMap[p.unit_id] || "—"}</div>
                  <div className="text-sm font-semibold text-gray-800">₱{Number(p.price).toFixed(2)}</div>
                  <div className="text-xs text-gray-600">Qty: {p.total_quantity ?? "—"}</div>
                  <div className="text-[11px] text-gray-500">Restocked: {p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop/Tablet: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-[720px] w-full border-collapse text-sm shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3 text-left border-b-2 border-gray-300">Product</th>
                  <th className="p-3 text-left border-b-2 border-gray-300">Unit</th>
                  <th className="p-3 text-left border-b-2 border-gray-300">Price</th>
                  <th className="p-3 text-left border-b-2 border-gray-300">Quantity</th>
                  <th className="p-3 text-left border-b-2 border-gray-300">Last Restocked</th>
                  <th className="p-3 text-left border-b-2 border-gray-300">Image</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p, index) => (
                  <tr key={p.product_id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="p-3 border-b border-gray-200">{p.name}</td>
                    <td className="p-3 border-b border-gray-200">{unitsMap[p.unit_id] || "—"}</td>
                    <td className="p-3 border-b border-gray-200">₱{Number(p.price).toFixed(2)}</td>
                    <td className="p-3 border-b border-gray-200">{p.total_quantity ?? "—"}</td>
                    <td className="p-3 border-b border-gray-200">
                      {p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {p.picture ? (
                        <img src={p.picture} alt={p.name} className="w-12 h-12 object-cover rounded" loading="lazy" />
                      ) : (
                        "No image"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListComponent;
