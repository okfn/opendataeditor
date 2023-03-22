import React from 'react'
import ReactDOM from 'react-dom'

/**
 * Render a component
 *
 * @param {Component} component - one of provided by the library component e.g. `Metadata`
 * @param {Object} props - object containing props
 * @param {Element} element - DOM element to render into
 */
export function render(component: any, props: any, element: any) {
  ReactDOM.render(React.createElement(component, props, null), element)
}
