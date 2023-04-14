import * as React from 'react'
import * as ReactDOMClient from 'react-dom/client'

/**
 * Render a component
 *
 * @param {Component} component - one of provided by the library component e.g. `Metadata`
 * @param {Object} props - object containing props
 * @param {Element} element - DOM element to render into
 */
export function render(component: any, props: any, element: any) {
  const node = React.createElement(component, props, null)
  const root = ReactDOMClient.createRoot(element)
  root.render(node)
}
