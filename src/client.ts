import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'

export class Client {
  public static start(element: any) {
    ReactDOM.render(React.createElement(App, {}, null), element)
    return { dispose: () => ReactDOM.unmountComponentAtNode(element) }
  }
}
