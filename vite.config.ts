import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    host: '127.0.0.1',
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
  preview: {
    proxy: { '/api': 'http://127.0.0.1:8787' },
  },
})
