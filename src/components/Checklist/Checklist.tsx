import * as React from 'react'
import { IChecklist, ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
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
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <Provider createStore={() => makeStore(props)}>
        <Layout />
      </Provider>
    </ThemeProvider>
  )
}
