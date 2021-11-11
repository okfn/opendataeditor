import * as React from 'react'
import Describe from './pages/Describe'
import Extract from './pages/Extract'
import Validate from './pages/Validate'
import Transform from './pages/Transform'
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
    case 'validate':
      return <Validate state={state} dispatch={dispatch} />
    case 'transform':
      return <Transform state={state} dispatch={dispatch} />
    default:
      return <Home />
  }
}
