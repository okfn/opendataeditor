import React from 'react'
import ReactDOM from 'react-dom'
import Application from './components/Application'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import '@fontsource/roboto-mono'

const application = document.createElement('div')
application.setAttribute('id', 'application')
document.body.appendChild(application)
ReactDOM.render(React.createElement(Application, {}, null), application)
