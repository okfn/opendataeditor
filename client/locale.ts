import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from '../locales'

i18next.use(initReactI18next).init({
  fallbackLng: 'en',
  defaultNS: 'main',
  resources,
})

i18next.services.formatter?.add('lowercase', (value) => {
  return value.toLowerCase()
})
