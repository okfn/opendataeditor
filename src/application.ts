import '@fontsource/roboto-mono'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import React from 'react'
import ReactDOM from 'react-dom'
import { Client } from './client'
import Application from './components/Applications/Application'

const session = localStorage.getItem('session') || undefined
Client.connect({ session }).then((client) => {
  if (client.session) localStorage.setItem('session', client.session)
  const application = document.createElement('div')
  application.setAttribute('id', 'application')
  document.body.appendChild(application)
  ReactDOM.render(
    React.createElement(Application, { client, init: true }, null),
    application
  )
})
