import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    // Gunakan true (tanpa kutip) untuk mengizinkan semua host termasuk Ngrok
    allowedHosts: true, 
    // Tambahkan host: true agar server bisa diakses dari jaringan luar/tunnel
    host: true,
    cors: true,
  }
})