import * as React from 'react'
import BasicTabs from './Tabs'

export interface ContentProps {
  state: any
}

export default function Content(props: ContentProps) {
  return (
    <div>
      <BasicTabs />
      <div>{props.state.file ? props.state.file.name : 'no file'}</div>
    </div>
  )
}
