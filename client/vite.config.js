import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    proxy: {
      '/api/horizons': {
        target: 'https://ssd.jpl.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/horizons/, '/api/horizons.api'),
      },
      '/api/heasarc': {
        target: 'https://heasarc.gsfc.nasa.gov',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/heasarc/, '/cgi-bin/Tools/convcoord/convcoord.pl'),
      },
    },
  },
})
