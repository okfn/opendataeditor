import * as React from 'react'

// TODO: restyle scrolls (use Table's style)

interface SourceProps {
  source: string
}

export default function Source(props: SourceProps) {
  return (
    <code
      style={{
        whiteSpace: 'pre-wrap',
        fontSize: '80%',
        margin: 0,
        padding: 0,
        color: '#333',
      }}
    >
      {props.source}
    </code>
  )
}
