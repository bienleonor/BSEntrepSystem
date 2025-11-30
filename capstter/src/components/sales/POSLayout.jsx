import React, { useEffect, useState, useCallback } from "react";
import { getToken } from "../../utils/token";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CartProvider, useCart } from "./CartContext";
import InventoryGrid from "./InventoryGrid";
import Cart from "./Cart";
import { getInventory } from "../../services/inventoryApi";
import { createSale } from "../../services/salesApi";


const REFRESH_INTERVAL = 10000;

export default function POSLayout() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [saleDate, setSaleDate] = useState(new Date().toISOString().slice(0, 10));
  const businessId = localStorage.getItem("selectedBusinessId") || "";
  const token = getToken();
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  const fetchInventory = useCallback(async () => {
    if (!businessId) return;
    try {
      setLoading(true);
      const list = await getInventory(businessId, token);
      setInventory(list);
    } catch (err) {
      toast.error("Unable to load inventory");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [businessId, token]);

  //redirect to busmanage
  useEffect(() => {
    if (!businessId) {
      toast.error("No business selected. Redirecting...");
      setTimeout(() => navigate("/busmanage"), 1500);
      return;
    }
    fetchInventory();
    const id = setInterval(fetchInventory, REFRESH_INTERVAL);
    return () => clearInterval(id);
  }, [businessId, fetchInventory, navigate]);

  const { addToCart } = useCart();

const submitSaleHandler = async () => {
  const cartItems = Object.values(cart);
  if (!cartItems.length) {
    toast.warn("Cart is empty");
    return;
  }

  const paymentMethod = "Cash"; // make dynamic later
  const statId = 2; // example status ID

  const saleData = {
    business_id: businessId,
    user_id: token?.user_id,
    total_amount: cartItems.reduce((s, it) => s + it.quantity * Number(it.price), 0),
    sale_date: saleDate,
    payment_method: paymentMethod,
    stat_id: statId,
    items: cartItems.map((it) => ({
      product_id: it.product_id,
      quantity: it.total_quantity,
      price: it.price,
    })),
  };

  try {
    setSubmitting(true);
    const data = await createSale(saleData, token);

    // ✅ show receipt number instead of sale_id
    toast.success(`Sale created (Receipt: ${data.custom_receipt_no})`);

    clearCart();
    fetchInventory();
  } catch (err) {
    toast.error(`Sale failed: ${err.message}`);
    console.error(err);
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="p-3 sm:p-4">
      <h3 className="text-2xl sm:text-3xl lg:text-6xl font-bold mb-4 text-white">POS Terminal</h3>
      <ToastContainer position="top-center" autoClose={3000} theme="colored" />

      <div className="flex flex-col lg:flex-row gap-3 lg:gap-4">
        <div className="w-full lg:w-2/3">
          <h4 className="text-lg sm:text-xl font-semibold mb-2 text-white">
            Inventory {loading ? "(loading...)" : ""}
          </h4>
          <InventoryGrid inventory={inventory} onAddToCart={addToCart} loading={loading} />
        </div>

        <div className="w-full lg:w-1/3 lg:sticky lg:top-4">
          <h4 className="text-2xl sm:text-3xl lg:text-4xl text-white font-semibold mb-2">Cart</h4>
          <Cart
            inventory={inventory}
            saleDate={saleDate}
            setSaleDate={setSaleDate}
            submitSale={submitSaleHandler}
            submitting={submitting}
          />
        </div>
      </div>
    </div>
  );
}

// Wrap POSLayout with CartProvider when used
export function POS1Wrapper() {
  return (
    <CartProvider>
      <POSLayout />
    </CartProvider>
  );
}
