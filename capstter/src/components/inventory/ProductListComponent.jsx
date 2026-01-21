import React, { useEffect, useState } from "react";
import { getToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const REFRESH_INTERVAL = 30000; // 30 seconds
const FALLBACK = "/fallback.png";

const ProductListComponent = () => {
  const [products, setProducts] = useState([]);
  const [unitsMap, setUnitsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (qty) => {
    if (qty === null || qty === undefined) return { color: "text-gray-500", bg: "bg-gray-100", label: "Unknown" };
    if (qty <= 0) return { color: "text-red-600", bg: "bg-red-100", label: "Out of Stock" };
    if (qty <= 10) return { color: "text-amber-600", bg: "bg-amber-100", label: "Low Stock" };
    return { color: "text-green-600", bg: "bg-green-100", label: "In Stock" };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight">
          Product Inventory
        </h1>
        <p className="mt-2 text-gray-600 text-sm sm:text-base">
          View and manage your active products
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Total Products</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{products.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-xs uppercase tracking-wider">In Stock</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {products.filter(p => (p.total_quantity ?? 0) > 10).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Low Stock</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">
            {products.filter(p => (p.total_quantity ?? 0) > 0 && (p.total_quantity ?? 0) <= 10).length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-gray-500 text-xs uppercase tracking-wider">Out of Stock</p>
          <p className="text-2xl font-bold text-rose-600 mt-1">
            {products.filter(p => (p.total_quantity ?? 0) <= 0).length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-500"></div>
          <span className="ml-4 text-gray-900 font-medium">Loading products...</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-5 py-4 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center shadow-sm">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg className="w-7 h-7 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">No products found</h3>
          <p className="text-gray-500 text-md">
            {searchTerm ? "Try a different search term" : "Add products to see them here"}
          </p>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && (
        <>
          {/* Mobile: Card Grid */}
          <div className="md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((p) => {
              const status = getStockStatus(p.total_quantity);
              return (
                <div 
                  key={p.product_id} 
                  className="group bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                >
                  {/* Image Section */}
                  <div className="relative h-40 bg-gray-100 overflow-hidden">
                    <img 
                      src={p.picture || FALLBACK} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                    {/* Stock Status Badge */}
                    <div className={`absolute top-3 right-3 ${status.bg} backdrop-blur-sm px-2.5 py-1 rounded-full`}>
                      <span className={`text-md font-medium ${status.color}`}>{status.label}</span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
                      <span className="text-gray-900 font-bold">₱{Number(p.price).toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 truncate mb-2">{p.name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Unit: {unitsMap[p.unit_id] || "—"}</span>
                      <span className="text-gray-700 font-medium">Qty: {p.total_quantity ?? "—"}</span>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Restocked: {p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Restocked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.map((p) => {
                    const status = getStockStatus(p.total_quantity);
                    return (
                      <tr key={p.product_id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                              <img 
                                src={p.picture || FALLBACK} 
                                alt={p.name} 
                                className="w-full h-full object-cover" 
                                loading="lazy" 
                              />
                            </div>
                            <span className="font-medium text-gray-900">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{unitsMap[p.unit_id] || "—"}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">₱{Number(p.price).toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-gray-800">{p.total_quantity ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          {p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductListComponent;
