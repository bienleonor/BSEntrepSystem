import React, { useEffect, useState } from "react";
import OrderCard from "../../components/createorder/OrderCard.jsx";
import DashboardLayout from "../../components/layout/DashboardLayout.jsx";
import { getToken } from "../../utils/token";

// 🔧 Cache image as base64 in localStorage
const downloadImageToCache = async (url, key) => {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      localStorage.setItem(`product-img-${key}`, reader.result);
    };
  } catch (err) {
    console.warn(`Failed to cache image for ${key}:`, err.message);
  }
};

// 🔍 Retrieve cached image
const getCachedImage = (key) => {
  return localStorage.getItem(`product-img-${key}`);
};

export default function ProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const token = getToken();
    fetch("http://localhost:5000/api/inventory/products", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProducts(data);
        // Cache images for offline use
        data.forEach((product) => {
          if (navigator.onLine && product.picture) {
            downloadImageToCache(product.picture, product.product_id);
          }
        });
      })
      .catch((err) => {
        console.error("Product fetch error:", err.message);
      });
  }, []);

  return (
    <DashboardLayout>
      <section className="mt-6">
        <h2 className="text-xl font-bold mb-4">Create Order</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => {
            const cachedImage = getCachedImage(product.product_id);
            const imageSrc =
              navigator.onLine && product.picture
                ? product.picture
                : cachedImage || "/fallback.jpg";

            return (
              <OrderCard
                key={product.product_id}
                ProductImage={imageSrc}
                ProductName={product.name}
                Price={`₱${product.price}`}
                Quantity={1}
              />
            );
          })}
        </div>
      </section>
    </DashboardLayout>
  );
}
