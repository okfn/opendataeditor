// Preserve the order of the imports with comments
import '@client/locale'
// ---
import '@fontsource-variable/hanken-grotesk'
// ---
import Application from '@client/components/Application'
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'

const element = document.getElementById('root')
const node = React.createElement(Application, {}, null)
const root = ReactDOMClient.createRoot(element as any)

root.render(node)
