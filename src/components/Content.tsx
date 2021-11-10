import * as React from 'react'

export interface ContentProps {
  state: any
}

export default function Content(props: ContentProps) {
  return <div>{props.state.file ? props.state.file.name : 'no file'}</div>
}
