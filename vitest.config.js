/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import yaml from '@modyfi/vite-plugin-yaml'

export default defineConfig({
  plugins: [react(), yaml()],
  test: {
    include: ['**/__spec__/*.(ts|tsx)'],
    coverage: {
      enabled: true,
      reporter: ['html'],
    },
  },
})
