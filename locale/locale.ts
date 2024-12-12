import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import { languages } from './data'
import * as translations from './translations'

export function initLocale(props: { useReact?: boolean }) {
  if (props.useReact) {
    i18next.use(initReactI18next)
  }

  i18next.init({
    fallbackLng: 'en',
    defaultNS: 'main',
    resources: Object.fromEntries(
      languages.map((language) => [language.code, { main: translations[language.code] }])
    ),
  })

  i18next.services.formatter?.add('lowercase', (value) => {
    return value.toLowerCase()
  })
}
