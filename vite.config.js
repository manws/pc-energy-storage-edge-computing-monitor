import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    server: {
      host: true,
      port: 5174,
      proxy: env.VITE_API_PROXY
        ? {
            '/api': {
              target: env.VITE_API_PROXY,
              changeOrigin: true
            }
          }
        : undefined
    }
  }
})
