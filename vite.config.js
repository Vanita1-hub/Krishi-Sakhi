import { defineConfig } from 'vite'
import react from '@vitejs/react-refresh' // Or your specific framework plugin

export default defineConfig({
  plugins: [react()],
  base: '/Krishi-Sakhi/', // ⚠️ Replace this with your actual GitHub repo name
})
