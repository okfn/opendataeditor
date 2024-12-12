import en from './en.json'
import es from './es.json'
import fr from './fr.json'
import pt from './pt.json'

export const resources = {
  en: { main: en },
  es: { main: es },
  fr: { main: fr },
  pt: { main: pt },
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'main'
    resources: { main: typeof en }
  }
}

