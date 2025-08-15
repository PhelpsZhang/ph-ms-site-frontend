import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/api'

const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      return data
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/auth/register', payload)
      return data
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message)
    }
  }
)

export const fetchMe = createAsyncThunk(
  'auth/fetchMe',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/auth/me')
      return data
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message)
    }
  }
)

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null
      state.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },
    setUser(state, action) {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        const d = action.payload || {}
        if (d.token) { state.token = d.token; localStorage.setItem('token', d.token) }
        if (d.user)  { state.user  = d.user;  localStorage.setItem('user', JSON.stringify(d.user)) }
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload || String(action.error.message) })

      .addCase(register.pending, (state) => { state.loading = true; state.error = null })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        const d = action.payload || {}
        if (d.token) { state.token = d.token; localStorage.setItem('token', d.token) }
        if (d.user)  { state.user  = d.user;  localStorage.setItem('user', JSON.stringify(d.user)) }
      })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload || String(action.error.message) })

      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload
        localStorage.setItem('user', JSON.stringify(action.payload))
      })
  }
})

export const { logout, setUser } = slice.actions
export default slice.reducer