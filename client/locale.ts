import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as locales from '../locales'

export function initLocale() {
  i18next.use(initReactI18next).init({
    fallbackLng: 'en',
    defaultNS: 'main',
    resources: {
      en: { main: locales.en },
      es: { main: locales.es },
      fr: { main: locales.fr },
      pt: { main: locales.pt },
    },
  })

  i18next.services.formatter?.add('lowercase', (value) => {
    return value.toLowerCase()
  })
}
