import '@fontsource-variable/hanken-grotesk'
import '@fontsource/roboto-mono'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'
import Application from './components/Application'

const element = document.getElementById('root')
const node = React.createElement(Application, {}, null)
const root = ReactDOMClient.createRoot(element as any)

root.render(node)
