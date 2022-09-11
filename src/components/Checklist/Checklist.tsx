import * as React from 'react'
import { IChecklist, ISchema } from '../../interfaces'
import { StoreProvider, createStore } from './store'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../themes'
import Layout from './Layout'

export interface ChecklistProps {
  checklist?: IChecklist
  schema?: ISchema
  onCommit?: (checklist: IChecklist) => void
  onRevert?: (checklist: IChecklist) => void
}

export default function Checklist(props: ChecklistProps) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <StoreProvider value={store}>
        <Layout />
      </StoreProvider>
    </ThemeProvider>
  )
}
