import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // No Windows o Node pode escutar só em IPv6 (::1); fixar IPv4 evita "não abre" em 127.0.0.1.
  server: { host: '127.0.0.1', open: true },
  preview: { host: '127.0.0.1' },
})
