import * as React from 'react'
import BasicTabs from './Tabs'

export interface ContentProps {
  state: any
}

export default function Content(props: ContentProps) {
  const { state } = props
  return <div>{state.resource && <BasicTabs state={state} />}</div>
}
