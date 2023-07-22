import './Iframe.css'
import * as React from 'react'

export interface IframeBoxProps {
  html: string
  height: string
}

export default function IframeBox(props: IframeBoxProps) {
  return (
    <iframe
      srcDoc={props.html}
      height={props.height}
      style={{
        margin: 0,
        padding: 0,
        border: 'none',
        overflow: 'auto',
        width: '100%',
      }}
    ></iframe>
  )
}
