import * as React from 'react'
import { StoreProvider, makeStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import { ITextContent } from '../../../interfaces'
import * as themes from '../../../themes'
import Layout from './Layout'

export interface TextProps {
  diff?: boolean
  format?: string
  content: ITextContent
  onChange?: (text: any) => void
}

export default function Text(props: TextProps) {
  const store = React.useMemo(() => makeStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
