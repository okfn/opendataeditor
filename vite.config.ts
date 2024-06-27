/// <reference types="vitest" />
import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  root: 'client',
  plugins: [react(), yaml()],
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, 'client'),
    },
  },
  test: {
    include: ['**/__spec__/*.(ts|tsx)'],
    coverage: {
      enabled: true,
      reporter: ['html'],
    },
  },
})
