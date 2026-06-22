const { defineConfig, transformWithEsbuild } = require('vite')
const preact = require('@preact/preset-vite').default
const svgr = require('vite-plugin-svgr')

const serverPort = 8080
const apiTarget = 'http://localhost:3000'
const jsFileRegex = /src\/.*\.js$/

module.exports = defineConfig(({ mode }) => ({
  root: __dirname,
  publicDir: 'src/static',
  plugins: [
    {
      name: 'rctf-js-as-jsx',
      async transform(code, id) {
        if (!jsFileRegex.test(id)) {
          return null
        }

        return await transformWithEsbuild(code, id, {
          loader: 'jsx',
          jsx: 'automatic',
          jsxImportSource: 'preact',
        })
      },
    },
    preact(),
    svgr({
      include: '**/*.svg',
    }),
  ],
  define: {
    'process.env.NODE_ENV': JSON.stringify(
      mode === 'production' ? 'production' : 'development'
    ),
  },
  resolve: {
    alias: {
      react: 'preact/compat',
      'react-dom': 'preact/compat',
    },
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
