import '@fontsource-variable/hanken-grotesk'
// --- (keep import order using comments) ---
import Application from '@client/components/Application'
import { initLocale } from '@locale/index'
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'

initLocale({ useReact: true })

const element = document.getElementById('root')
const node = React.createElement(Application, {}, null)
const root = ReactDOMClient.createRoot(element as any)

root.render(node)
