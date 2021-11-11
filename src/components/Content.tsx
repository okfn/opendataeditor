import * as React from 'react'
import Describe from './describe/Describe'

export interface ContentProps {
  state: any
  dispatch: any
}

export default function Content(props: ContentProps) {
  const { state, dispatch } = props
  return <div>{state.resource && <Describe state={state} dispatch={dispatch} />}</div>
}
