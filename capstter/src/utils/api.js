const jsonHeaders = (token, businessId) => ({
  "Content-Type": "application/json",
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
  ...(businessId ? { "X-Business-ID": businessId } : {})
});

export default {
  get: (path, token) =>
    fetch(path, {
      method: "GET",
      headers: jsonHeaders(token)
    }),

  post: (path, token, body) =>
    fetch(path, {
      method: "POST",
      headers: jsonHeaders(token),
      body: JSON.stringify(body)
    }),

  put: (path, token, body) =>
    fetch(path, {
      method: "PUT",
      headers: jsonHeaders(token),
      body: JSON.stringify(body)
    }),

  del: (path, token) =>
    fetch(path, {
      method: "DELETE",
      headers: jsonHeaders(token)
    })
};

export const getInventory = async (businessId, token) => {
  const res = await fetch(
    `http://localhost:5000/api/inventory/products/active/inventory-details/${businessId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
};

export const createSale = async (saleData, token) => {
  const businessId = localStorage.getItem("selectedBusinessId"); // Get business ID
  
  const res = await fetch("http://localhost:5000/api/sales/create", {
    method: "POST",
    headers: { 
      "Content-Type": "application/json", 
      Authorization: `Bearer ${token}`,
      "X-Business-ID": businessId  // ✅ Add this header!
    },
    body: JSON.stringify(saleData),
  });
  
  if (!res.ok) {
    const errBody = await res.json().catch(() => ({}));
    throw new Error(errBody.error || `Status ${res.status}`);
  }
  return res.json();
};