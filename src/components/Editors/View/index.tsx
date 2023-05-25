import * as React from 'react'
import * as themes from '../../../themes'
import { ITextEditor } from '../../Parts/TextEditor'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import { IView, IFieldItem } from '../../../interfaces'
import Layout from './Layout'

export interface ViewProps {
  view?: IView
  fields?: IFieldItem[]
  onChange?: (view: IView) => void
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
