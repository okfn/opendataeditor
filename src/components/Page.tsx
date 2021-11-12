import * as React from 'react'
import Describe from './Pages/Describe'
import Extract from './Pages/Extract'
import Validate from './Pages/Validate'
import Transform from './Pages/Transform'
import Home from './Pages/Home'

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
