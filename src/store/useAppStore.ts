import { create } from 'zustand';
import { CartItem, StoreLocation } from '../types';

interface AppState {
  ageVerified: boolean;
  selectedStore: StoreLocation;
  favorites: string[];
  cartStore: StoreLocation | null;
  cart: CartItem[];
  setAgeVerified: (value: boolean) => void;
  setSelectedStore: (store: StoreLocation) => void;
  toggleFavorite: (productId: string) => void;
  addToCart: (item: CartItem, storeId: StoreLocation) => { ok: boolean; message?: string };
  updateQuantity: (productId: string, variantId: string, quantity: number) => void;
  clearCart: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  ageVerified: false,
  selectedStore: 'abington',
  favorites: [],
  cartStore: null,
  cart: [],
  setAgeVerified: (value) => set({ ageVerified: value }),
  setSelectedStore: (store) => set({ selectedStore: store }),
  toggleFavorite: (productId) => set((state) => ({
    favorites: state.favorites.includes(productId)
      ? state.favorites.filter((id) => id !== productId)
      : [...state.favorites, productId]
  })),
  addToCart: (item, storeId) => {
    let result = { ok: true } as { ok: boolean; message?: string };
    set((state) => {
      if (state.cartStore && state.cartStore !== storeId) {
        result = { ok: false, message: 'Cart is locked to one store. Clear it before switching stores.' };
        return state;
      }
      const existing = state.cart.find((cartItem) => cartItem.productId === item.productId && cartItem.variantId === item.variantId);
      if (existing) {
        return {
          cartStore: storeId,
          cart: state.cart.map((cartItem) =>
            cartItem.productId === item.productId && cartItem.variantId === item.variantId
              ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
              : cartItem
          )
        };
      }
      return { cartStore: storeId, cart: [...state.cart, item] };
    });
    return result;
  },
  updateQuantity: (productId, variantId, quantity) => set((state) => {
    const nextCart = state.cart
      .map((item) => item.productId === productId && item.variantId === variantId ? { ...item, quantity } : item)
      .filter((item) => item.quantity > 0);
    return { cart: nextCart, cartStore: nextCart.length ? state.cartStore : null };
  }),
  clearCart: () => set({ cart: [], cartStore: null })
}));
