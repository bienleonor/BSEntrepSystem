import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, qty } = action.payload;
      const currentQty = state[product.product_id]?.quantity || 0;
      // compute available packs robustly: prefer product.quantity, else derive from total_quantity/unit_multiplier
      const available = (product.quantity != null)
        ? Number(product.quantity)
        : Math.floor((Number(product.total_quantity ?? 0) || 0) / (Number(product.unit_multiplier ?? 1) || 1));
      const nextQty = Math.min(available, currentQty + qty);
      return {
        ...state,
        [product.product_id]: {
          product_id: product.product_id,
          name: product.name,
          price: Number(product.price),
          quantity: nextQty,
        },
      };
    }
    case "UPDATE_CART_QTY": {
      const { productId, qty } = action.payload;
      const next = { ...state };
      if (qty <= 0) delete next[productId];
      else next[productId] = { ...next[productId], quantity: qty };
      return next;
    }
    case "CLEAR_CART":
      return {};
    default:
      return state;
  }
}

export const CartProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(reducer, initialState);

  const addToCart = (product, qty = 1) =>
    dispatch({ type: "ADD_TO_CART", payload: { product, qty } });

  const updateCartQty = (productId, qty) =>
    dispatch({ type: "UPDATE_CART_QTY", payload: { productId, qty } });

  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  return (
    <CartContext.Provider value={{ cart, addToCart, updateCartQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
