import * as React from 'react'
import Describe from './describe/Describe'
import Extract from './extract/Extract'
import Home from './pages/Home'

export interface PageProps {
  state: any
  dispatch: any
}

export default function Page(props: PageProps) {
  const { state, dispatch } = props
  switch (state.page) {
    case 'describe':
      return <Describe state={state} dispatch={dispatch} />
    case 'extract':
      return <Extract state={state} dispatch={dispatch} />
    default:
      return <Home />
  }
}
