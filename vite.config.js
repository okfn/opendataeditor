/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    include: ['**/__spec__/*.(ts|tsx)'],
    coverage: {
      enabled: true,
      reporter: ['html'],
    },
  },
})
