import { create } from 'zustand'
import api from '../lib/api'

const useAuth = create((set, get) => ({
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  loading: false,

  login: async (identifier, password) => {
    set({ loading: true })
    try {
      const payload = { usernameOrEmail: identifier.trim(), password}
      const { data } = await api.post('/auth/login', payload)
      localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      set({ token: data.token, user: data.user ?? get().user, loading: false })
      return { ok: true }
    } catch (e) {
      set({ loading: false })
      return { ok: false, error: e.response?.data?.message || e.message }
    }
  },

  register: async (payload) => {
    set({ loading: true })
    try {
      const { data } = await api.post('/auth/register', payload)
      // 注册成功后有的后端会直接返回 token + user，也有的需要再登录
      if (data.token) localStorage.setItem('token', data.token)
      if (data.user) localStorage.setItem('user', JSON.stringify(data.user))
      set({ token: data.token || null, user: data.user || null, loading: false })
      return { ok: true }
    } catch (e) {
      set({ loading: false })
      return { ok: false, error: e.response?.data?.message || e.message }
    }
  },

  fetchMe: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const { data } = await api.get('/auth/me')
      localStorage.setItem('user', JSON.stringify(data))
      set({ user: data })
    } catch (_) {}
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))

export default useAuth