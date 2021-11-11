import * as React from 'react'
import Describe from './describe/Describe'

export interface PageProps {
  state: any
  dispatch: any
}

export default function Page(props: PageProps) {
  const { state, dispatch } = props
  return <div>{state.resource && <Describe state={state} dispatch={dispatch} />}</div>
}
