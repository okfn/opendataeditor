import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

export class Client {
  start(element: any) {
    ReactDOM.render(React.createElement(App, {}, null), element)
    return { dispose: () => ReactDOM.unmountComponentAtNode(element) }
  }
}

export const client = new Client()
