import { create } from "zustand";

export const useUiStore = create((set) => ({
  isCartOpen: false,
  isMobileNavOpen: false,
  isSearchOpen: false,
  quickViewProduct: null,
  
  setCartOpen: (open) => set({ isCartOpen: open }),
  setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
  setSearchOpen: (open) => set({ isSearchOpen: open }),
  setQuickViewProduct: (product) => set({ quickViewProduct: product })
}));
