import * as React from 'react'
import { ITextEditor } from '../Text'
import { StoreProvider, makeStore } from './store'
import Layout from './Layout'
import * as types from '../../../types'

export interface ViewProps {
  view?: types.IView
  columns?: types.IColumn[]
  onChange?: (view: types.IView) => void
}

export default function View(props: ViewProps) {
  const editorRef = React.useMemo(() => React.createRef<ITextEditor>(), [])
  const store = React.useMemo(() => makeStore(props, editorRef), Object.values(props))
  return (
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
  )
}
