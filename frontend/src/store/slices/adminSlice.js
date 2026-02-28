import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchDashboard = createAsyncThunk('admin/dashboard', async (_, { rejectWithValue }) => {
  try { const { data } = await api.get('/dashboard/stats'); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAllOrders = createAsyncThunk('admin/orders', async (params, { rejectWithValue }) => {
  try { const q = new URLSearchParams(params).toString(); const { data } = await api.get(`/orders?${q}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateOrderStatus = createAsyncThunk('admin/updateOrder', async ({ id, ...body }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/orders/${id}/status`, body); return data.order; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchAllUsers = createAsyncThunk('admin/users', async (params, { rejectWithValue }) => {
  try { const q = new URLSearchParams(params).toString(); const { data } = await api.get(`/users?${q}`); return data; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const createProduct = createAsyncThunk('admin/createProduct', async (productData, { rejectWithValue }) => {
  try { const { data } = await api.post('/products', productData); return data.product; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const updateProduct = createAsyncThunk('admin/updateProduct', async ({ id, ...rest }, { rejectWithValue }) => {
  try { const { data } = await api.put(`/products/${id}`, rest); return data.product; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const deleteProduct = createAsyncThunk('admin/deleteProduct', async (id, { rejectWithValue }) => {
  try { await api.delete(`/products/${id}`); return id; }
  catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const adminSlice = createSlice({
  name: 'admin',
  initialState: { dashboard: null, orders: [], users: [], loading: false, error: null, success: false, total: 0, pages: 1 },
  reducers: { clearAdminState: (state) => { state.success = false; state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.fulfilled, (state, action) => { state.dashboard = action.payload; })
      .addCase(fetchAllOrders.fulfilled, (state, action) => { state.orders = action.payload.orders; state.total = action.payload.total; state.pages = action.payload.pages; })
      .addCase(updateOrderStatus.fulfilled, (state, action) => { const idx = state.orders.findIndex(o => o._id === action.payload._id); if (idx !== -1) state.orders[idx] = action.payload; })
      .addCase(fetchAllUsers.fulfilled, (state, action) => { state.users = action.payload.users; state.total = action.payload.total; })
      .addCase(createProduct.fulfilled, (state) => { state.success = true; })
      .addCase(deleteProduct.fulfilled, (state, action) => { state.success = true; });
  },
});

export const { clearAdminState } = adminSlice.actions;
export default adminSlice.reducer;
