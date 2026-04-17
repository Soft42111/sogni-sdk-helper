import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/sogni-api': {
        target: 'https://api.sogni.ai',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sogni-api/, '')
      }
    }
  }
})
