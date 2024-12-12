import type en from './en.json'

export { default as en } from './en.json'
export { default as es } from './es.json'
export { default as fr } from './fr.json'
export { default as pt } from './pt.json'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'main'
    resources: { main: typeof en }
  }
}
