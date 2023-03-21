import * as React from 'react'

// TODO: restyle scrolls (use Table's style)

interface SourceProps {
  source: string
}

export default function Source(props: SourceProps) {
  return <code>{props.source}</code>
}
