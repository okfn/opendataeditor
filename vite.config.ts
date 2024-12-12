/// <reference types="vitest" />
import yaml from '@modyfi/vite-plugin-yaml'
import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  root: 'client',
  plugins: [react(), yaml()],
  // TODO: Rebase on useTsconfigPath plugin
  resolve: {
    alias: {
      '@client': path.resolve(__dirname, 'client'),
      '@desktop': path.resolve(__dirname, 'desktop'),
      '@locale': path.resolve(__dirname, 'locale'),
    },
  },
  test: {
    include: ['**/__spec__/*.(ts|tsx)'],
    environment: 'jsdom',
    coverage: {
      enabled: true,
      reporter: ['html'],
    },
  },
})
