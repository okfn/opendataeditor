import * as React from 'react'
import { IChecklist, ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

export interface ChecklistProps {
  checklist?: IChecklist
  schema?: ISchema
  onCommit?: (checklist: IChecklist) => void
  onRevert?: (checklist: IChecklist) => void
}

export default function Checklist(props: ChecklistProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
