import path from 'path'
import { defineConfig, loadEnv } from 'vite'

// vite plugins
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'
import imagemin from 'unplugin-imagemin/vite'
import { compression } from 'vite-plugin-compression2'
import svgr from 'vite-plugin-svgr'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [svgr(), react(), compression(), imagemin(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: Number(env.VITE_PORT) ?? 5173,
      host: '0.0.0.0',
    },
    preview: {
      port: Number(env.VITE_PORT) ?? 5173,
      host: '0.0.0.0',
      allowedHosts: ['admin.tinz.vn'],
    },
  }
})
