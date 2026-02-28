import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try { return JSON.parse(localStorage.getItem('cart')) || []; } catch { return []; }
};

const saveCart = (items) => localStorage.setItem('cart', JSON.stringify(items));

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: loadCart(), shippingAddress: null },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existing = state.items.find(i => i._id === product._id);
      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, product.stock);
      } else {
        state.items.push({ ...product, quantity });
      }
      saveCart(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(i => i._id !== action.payload);
      saveCart(state.items);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(i => i._id === id);
      if (item) { item.quantity = quantity; if (item.quantity <= 0) state.items = state.items.filter(i => i._id !== id); }
      saveCart(state.items);
    },
    clearCart: (state) => { state.items = []; localStorage.removeItem('cart'); },
    setShippingAddress: (state, action) => { state.shippingAddress = action.payload; },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setShippingAddress } = cartSlice.actions;

export const selectCartTotal = (state) => state.cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export default cartSlice.reducer;
