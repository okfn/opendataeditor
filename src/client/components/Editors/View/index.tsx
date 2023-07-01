import * as React from 'react'
import * as themes from '../../../themes'
import { ITextEditor } from '../Text'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
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
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
