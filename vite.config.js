import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import jsconfigPaths from 'vite-jsconfig-paths'
import eslint from 'vite-plugin-eslint'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    jsconfigPaths(),
    svgr(),
    eslint()
  ],
  build: {
    chunkSizeWarningLimit: 100000, // Allow chunks up to ~2MB before warning
  }
})
