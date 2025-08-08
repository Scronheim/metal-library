import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import tailwindcss from '@tailwindcss/vite'
import vueDevTools from 'vite-plugin-vue-devtools'
// https://vite.dev/config/
export default defineConfig({
  base: '/eft/',
  plugins: [
    vue(),
    tailwindcss(),
    AutoImport({ resolvers: ElementPlusResolver() }),
    Components({ resolvers: ElementPlusResolver() }),
    vueDevTools(),
  ],
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'],
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          lodash: ['lodash', 'lodash-es'],
          elementPlus: ['element-plus']
        }
      }
    }
  },
  server: {
    proxy: {
      '/eft/api': {
        target: 'https://dark-corner.ru/',
        changeOrigin: true
      }
    }
  }
})
