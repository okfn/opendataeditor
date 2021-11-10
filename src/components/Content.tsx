import * as React from 'react'
import BasicTabs from './Tabs'

export interface ContentProps {
  state: any
  dispatch: any
}

export default function Content(props: ContentProps) {
  const { state, dispatch } = props
  return <div>{state.resource && <BasicTabs state={state} dispatch={dispatch} />}</div>
}
