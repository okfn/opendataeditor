import '@fontsource/roboto-mono'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import { render } from '../render'
import { Client } from '../client'
import Application from '../components/Application'

const client = new Client()
const application = document.createElement('div')
application.setAttribute('id', 'application')
document.body.appendChild(application)
render(Application, { client }, application)
