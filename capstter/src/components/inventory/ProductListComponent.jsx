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

  if (loading) return <p style={statusStyle}>Loading products...</p>;
  if (error) return <p style={statusStyle}>{error}</p>;

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>📦 Active Products with Inventory</h2>
      {products.length === 0 ? (
        <p style={statusStyle}>No active products found for this business.</p>
      ) : (
        <table style={tableStyle}>
          <thead>
            <tr style={headerRowStyle}>
              <th style={thStyle}>Product</th>
              <th style={thStyle}>Unit</th>
              <th style={thStyle}>Price</th>
              <th style={thStyle}>Quantity</th>
              <th style={thStyle}>Last Restocked</th>
              <th style={thStyle}>Image</th>
              <th style={thStyle}>Add Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p, index) => (
              <tr key={p.product_id} style={index % 2 === 0 ? rowStyle : altRowStyle}>
                <td style={tdStyle}>{p.name}</td>
                <td style={tdStyle}>{unitsMap[p.unit_id] || "—"}</td>
                <td style={tdStyle}>₱{p.price}</td>
                <td style={tdStyle}>{p.quantity ?? "—"}</td>
                <td style={tdStyle}>{p.last_restocked ? new Date(p.last_restocked).toLocaleDateString() : "—"}</td>
                <td style={tdStyle}>
                  {p.picture ? (
                    <img
                      src={p.picture}
                      alt={p.name}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                    />
                  ) : (
                    "No image"
                  )}
                </td>
                <td style={tdStyle}>
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    style={{ width: "60px", marginRight: "6px", padding: "4px" }}
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
                    style={{
                      padding: "4px 8px",
                      backgroundColor: "#4CAF50",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
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

// 💅 Styles
const containerStyle = {
  padding: "1rem",
  fontFamily: "Segoe UI, sans-serif",
};

const headingStyle = {
  marginBottom: "1rem",
  fontSize: "1.4rem",
  color: "#333",
};

const statusStyle = {
  fontSize: "1rem",
  color: "#666",
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse",
  fontSize: "0.95rem",
  boxShadow: "0 0 5px rgba(0,0,0,0.1)",
};

const headerRowStyle = {
  backgroundColor: "#f0f0f0",
};

const rowStyle = {
  backgroundColor: "#fff",
};

const altRowStyle = {
  backgroundColor: "#f9f9f9",
};

const thStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ccc",
};

const tdStyle = {
  padding: "10px",
  borderBottom: "1px solid #eee",
};

export default ProductListComponent;
