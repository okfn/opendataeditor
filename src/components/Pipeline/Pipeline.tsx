import * as React from 'react'
import { IPipeline, ISchema } from '../../interfaces'
import { StoreProvider, createStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface PipelineProps {
  pipeline?: IPipeline
  schema?: ISchema
  onCommit?: (pipeline: IPipeline) => void
  onRevert?: (pipeline: IPipeline) => void
}

export default function Pipeline(props: PipelineProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
