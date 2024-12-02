import '@fontsource/roboto-mono'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource-variable/hanken-grotesk'
import { render } from './render'
import { Client } from './client'
import Application from './components/Application'
import '../localization/i18n.config'

const client = new Client()
const element = document.getElementById('root')
render(Application, { client }, element)
