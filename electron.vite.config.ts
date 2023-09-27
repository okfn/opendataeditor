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
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: 'desktop/preload/index.ts' },
      outDir: 'build/desktop/preload',
    },
  },
  renderer: {
    root: 'client',
    plugins: [react(), yaml()],
    build: {
      outDir: 'build/client',
      rollupOptions: {
        input: {
          index: 'client/index.html',
        },
      },
    },
  },
})
