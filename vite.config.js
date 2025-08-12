import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // 可选：如果你的后端与前端同域，也可以不配代理
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:8080',
        changeOrigin: true,
        // rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})