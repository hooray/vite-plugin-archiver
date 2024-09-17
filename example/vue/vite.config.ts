import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import Archiver from 'vite-plugin-archiver'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), Archiver()],
})
