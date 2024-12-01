import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import * as locales from "../locales/index.ts"

i18next
    .use(initReactI18next)
    .init({
        fallbackLng : 'en',
        defaultNS: "main",
        resources: {
            en: { main: locales.en },
        }
    })
