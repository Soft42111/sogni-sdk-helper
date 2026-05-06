import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.versions.node': false
  },
  server: {
    proxy: {
      // The SDK's RestClient does new URL('/v1/...', baseUrl) which drops any
      // path prefix from baseUrl (e.g. '/sogni-api'). So we must proxy the
      // actual versioned API paths the SDK uses.
      '/v1': {
        target: 'https://api.sogni.ai',
        changeOrigin: true
      },
      '/v2': {
        target: 'https://api.sogni.ai',
        changeOrigin: true
      },
      '/v3': {
        target: 'https://api.sogni.ai',
        changeOrigin: true
      },
      '/v4': {
        target: 'https://api.sogni.ai',
        changeOrigin: true
      }
    }
  }
})
