import yaml from '@modyfi/vite-plugin-yaml'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import path from 'path'

// TODO: Rebase on useTsconfigPath plugin
const alias = {
  '@client': path.resolve(__dirname, 'client'),
  '@desktop': path.resolve(__dirname, 'desktop'),
  '@locale': path.resolve(__dirname, 'locale'),
}

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias },
    build: {
      lib: { entry: 'desktop/index.ts' },
      outDir: 'build/desktop',
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    resolve: { alias },
    build: {
      lib: { entry: 'desktop/preload/index.ts' },
      outDir: 'build/desktop/preload',
    },
  },
  renderer: {
    root: 'client',
    plugins: [react(), yaml()],
    resolve: { alias },
    build: {
      outDir: 'build/client',
      rollupOptions: {
        input: {
          loading: 'client/loading.html',
          index: 'client/index.html',
        },
      },
    },
  },
})
