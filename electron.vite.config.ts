import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: 'desktop/index.ts' },
      outDir: 'build/desktop',
    },
  },
  renderer: {
    root: 'client',
    plugins: [react(), yaml()],
    build: {
      outDir: 'build/client',
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'client/index.html'),
        },
      },
    },
  },
})
