import { create } from "zustand";

export const useCartStore = create((set, get) => ({
  cart: [],
  
  addToCart: (product, quantity = 1) => {
    const { cart } = get();
    const existingIndex = cart.findIndex((item) => item.product.id === product.id);
    
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      set({ cart: updatedCart });
    } else {
      set({ cart: [...cart, { product, quantity }] });
    }
  },
  
  removeFromCart: (productId) => {
    const { cart } = get();
    set({ cart: cart.filter((item) => item.product.id !== productId) });
  },
  
  updateQuantity: (productId, quantity) => {
    const { cart } = get();
    if (quantity <= 0) {
      set({ cart: cart.filter((item) => item.product.id !== productId) });
      return;
    }
    const updatedCart = cart.map((item) => 
      item.product.id === productId ? { ...item, quantity } : item
    );
    set({ cart: updatedCart });
  },
  
  clearCart: () => set({ cart: [] }),
  
  getCartSubtotal: () => {
    const { cart } = get();
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  },
  
  getCartCount: () => {
    const { cart } = get();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }
}));
