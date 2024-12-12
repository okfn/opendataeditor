import type en from './en.json'

export { default as en } from './en.json'
export { default as es } from './es.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'main'
    resources: { main: typeof en }
  }
}

