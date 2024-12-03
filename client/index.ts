import '@fontsource-variable/hanken-grotesk'
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import Application from './components/Application'
import '../localization/i18n.config'

const element = document.getElementById('root')
const node = React.createElement(Application, {}, null)
const root = ReactDOMClient.createRoot(element as any)

root.render(node)
