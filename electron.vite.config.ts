import { join } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: join('desktop', 'index.ts') },
      outDir: join('build', 'desktop'),
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      lib: { entry: join('desktop', 'preload', 'index.ts') },
      outDir: join('build', 'desktop', 'preload'),
    },
  },
  renderer: {
    root: 'client',
    plugins: [react(), yaml()],
    build: {
      outDir: 'build/client',
      rollupOptions: {
        input: {
          index: join('client', 'index.html'),
        },
      },
    },
  },
})
