import { createContext, useContext, useReducer } from "react";

const CartContext = createContext();

const initialState = {};

function reducer(state, action) {
  switch (action.type) {
    case "ADD_TO_CART": {
      const { product, qty } = action.payload;
      const currentQty = state[product.product_id]?.quantity || 0;
      // Use total_quantity as the available stock
      const available = Number(product.total_quantity ?? product.quantity ?? 0);
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
