import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as locales from '../locales'

i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  defaultNS: 'main',
  resources: {
    en: { main: locales.en },
    es: { main: locales.es },
  },
})

i18next.services.formatter?.add('lowercase', (value) => {
  return value.toLowerCase()
})
