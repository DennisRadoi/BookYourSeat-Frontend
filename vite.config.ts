import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // În development cererile către backend trec prin Vite. Browserul nu mai
      // face cereri cross-origin, deci nu poate bloca PATCH/GET din cauza CORS.
      '/backend': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': `${import.meta.dirname}/src`,
    },
  },
  optimizeDeps: {
    include: ["recharts"],
  },
})
