import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import flowbiteReact from "flowbite-react/plugin/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), flowbiteReact()],
  server: {
    host: true, // listen on all addresses, including LAN
    port: 80,
    strictPort: true,
    hmr: {
      host: '13.201.9.109',
      port: 80,
    },
  },
  preview: {
    host: true,
    port: 80,
    strictPort: true,
  },
})