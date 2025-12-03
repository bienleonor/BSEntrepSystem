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
    if (qty === null || qty === undefined) return { color: "text-slate-400", bg: "bg-slate-500/20", label: "Unknown" };
    if (qty <= 0) return { color: "text-rose-400", bg: "bg-rose-500/20", label: "Out of Stock" };
    if (qty <= 10) return { color: "text-amber-400", bg: "bg-amber-500/20", label: "Low Stock" };
    return { color: "text-emerald-400", bg: "bg-emerald-500/20", label: "In Stock" };
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white/90 tracking-tight">
          Product Inventory
        </h1>
        <p className="mt-2 text-white/60 text-sm sm:text-base">
          View and manage your active products
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-slate-800/80 border border-slate-700/50 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent"
          />
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Total Products</p>
          <p className="text-2xl font-bold text-white mt-1">{products.length}</p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase tracking-wider">In Stock</p>
          <p className="text-2xl font-bold text-emerald-400 mt-1">
            {products.filter(p => (p.total_quantity ?? 0) > 10).length}
          </p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Low Stock</p>
          <p className="text-2xl font-bold text-amber-400 mt-1">
            {products.filter(p => (p.total_quantity ?? 0) > 0 && (p.total_quantity ?? 0) <= 10).length}
          </p>
        </div>
        <div className="bg-slate-800/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Out of Stock</p>
          <p className="text-2xl font-bold text-rose-400 mt-1">
            {products.filter(p => (p.total_quantity ?? 0) <= 0).length}
          </p>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white/30 border-t-white"></div>
          <span className="ml-4 text-white font-medium">Loading products...</span>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-rose-500/20 border border-rose-400/30 text-rose-100 px-5 py-4 rounded-xl backdrop-blur-sm">
          {error}
        </div>
      )}

      {!loading && !error && filteredProducts.length === 0 && (
        <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 p-12 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-slate-700 flex items-center justify-center">
            <svg className="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-slate-200 mb-1">No products found</h3>
          <p className="text-slate-400 text-sm">
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
                  className="group bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/50 hover:border-slate-600/50 transition-all"
                >
                  {/* Image Section */}
                  <div className="relative h-40 bg-slate-700 overflow-hidden">
                    <img 
                      src={p.picture || FALLBACK} 
                      alt={p.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      loading="lazy" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                    {/* Stock Status Badge */}
                    <div className={`absolute top-3 right-3 ${status.bg} backdrop-blur-sm px-2.5 py-1 rounded-full`}>
                      <span className={`text-xs font-medium ${status.color}`}>{status.label}</span>
                    </div>
                    {/* Price Badge */}
                    <div className="absolute bottom-3 right-3 bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-white font-bold">₱{Number(p.price).toFixed(2)}</span>
                    </div>
                  </div>
                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate mb-2">{p.name}</h3>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-slate-400">Unit: {unitsMap[p.unit_id] || "—"}</span>
                      <span className="text-slate-300 font-medium">Qty: {p.total_quantity ?? "—"}</span>
                    </div>
                    <div className="mt-2 text-xs text-slate-500">
                      Restocked: {p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop: Table */}
          <div className="hidden md:block bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-700/50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">Last Restocked</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {filteredProducts.map((p) => {
                    const status = getStockStatus(p.total_quantity);
                    return (
                      <tr key={p.product_id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-700 flex-shrink-0">
                              <img 
                                src={p.picture || FALLBACK} 
                                alt={p.name} 
                                className="w-full h-full object-cover" 
                                loading="lazy" 
                              />
                            </div>
                            <span className="font-medium text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-slate-300">{unitsMap[p.unit_id] || "—"}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-white">₱{Number(p.price).toFixed(2)}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="font-medium text-slate-200">{p.total_quantity ?? "—"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                            {status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-400">
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
