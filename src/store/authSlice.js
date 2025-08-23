import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../lib/api'
import { normalizeAuthResponse, normalizeMeResponse } from '../utils/normalizers'
import { mapLoginRequest, mapRegisterRequest } from '../utils/mappers'

const initialState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, usernameOrEmail, password }, { rejectWithValue }) => {
    try {
      const body = mapLoginRequest({ email, usernameOrEmail, password })
      const { data } = await api.post('/auth/login', body)
      return normalizeAuthResponse(data)
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const body = mapRegisterRequest(payload)
      const { data } = await api.post('/auth/register', body)
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
      return normalizeMeResponse(data)
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
      // pending
      .addCase(login.pending,   (state) => { state.loading = true; state.error = null })
      .addCase(register.pending,(state) => { state.loading = true; state.error = null })

      // fulfilled（payload 已是 { token, user } 的统一结构）
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false
        const { token, user } = action.payload || {}
        if (token) { state.token = token; localStorage.setItem('token', token) }
        if (user)  { state.user  = user;  localStorage.setItem('user', JSON.stringify(user)) }
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false
        // const { token, user } = action.payload || {}
        // if (token) { state.token = token; localStorage.setItem('token', token) }
        // if (user)  { state.user  = user;  localStorage.setItem('user', JSON.stringify(user)) }
      })
      // .addCase(fetchMe.fulfilled, (state, action) => {
      //   const { user } = action.payload || {}
      //   if (user) {
      //     state.user = user
      //     localStorage.setItem('user', JSON.stringify(user))
      //   }
      // })

      // rejected
      .addCase(login.rejected,   (state, action) => { state.loading = false; state.error = action.payload || String(action.error?.message) })
      .addCase(register.rejected,(state, action) => { state.loading = false; state.error = action.payload || String(action.error?.message) })
  }
})

export const { logout, setUser } = slice.actions
export default slice.reducer
