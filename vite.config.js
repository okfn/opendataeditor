/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  root: 'client',
  build: {
    outDir: '../build/client',
  },
  plugins: [react(), yaml()],
  test: {
    include: ['**/__spec__/*.(ts|tsx)'],
    coverage: {
      enabled: true,
      reporter: ['html'],
    },
  },
})
