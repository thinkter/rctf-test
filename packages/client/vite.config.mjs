import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import svgLoader from 'vite-svg-loader'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const serverPort = 8080
const apiTarget = 'http://localhost:3000'

const devHtmlPlaceholderValues = {
  'config.ctfName': 'rCTF',
  'config.faviconUrl':
    'https://redpwn.storage.googleapis.com/branding/rctf-favicon.ico',
  'config.meta.description': '',
  'config.meta.imageUrl': '',
  'config.origin': `http://localhost:${serverPort}`,
  jsonConfig: '{}',
}

const devHtmlPlaceholderRE = /\{\{\s*([^}]+?)\s*\}\}/g

const devHtmlPlaceholders = () => ({
  name: 'rctf-dev-html-placeholders',
  apply: 'serve',
  transformIndexHtml(html) {
    return html.replace(devHtmlPlaceholderRE, (placeholder, key) =>
      Object.prototype.hasOwnProperty.call(devHtmlPlaceholderValues, key)
        ? devHtmlPlaceholderValues[key]
        : placeholder
    )
  },
})

export default defineConfig(({ mode }) => ({
  root: __dirname,
  publicDir: 'src/static',
  plugins: [devHtmlPlaceholders(), vue(), tailwindcss(), svgLoader()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'production' ? 'production' : 'development'
    ),
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.html',
    },
  },
  server: {
    host: '0.0.0.0',
    port: serverPort,
    strictPort: true,
    proxy: {
      '/api': apiTarget,
      '/uploads': apiTarget,
    },
  },
}))
