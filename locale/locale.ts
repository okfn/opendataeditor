import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as translations from './translations'

export function initLocale(props: { useReact?: boolean }) {
  if (props.useReact) {
    i18next.use(initReactI18next)
  }

  i18next.init({
    fallbackLng: 'en',
    defaultNS: 'main',
    resources: {
      en: { main: translations.en },
      es: { main: translations.es },
      fr: { main: translations.fr },
      pt: { main: translations.pt },
    },
  })

  i18next.services.formatter?.add('lowercase', (value) => {
    return value.toLowerCase()
  })
}
