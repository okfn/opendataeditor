import * as React from 'react'
import { IChecklist, ISchema } from '../../interfaces'
import { Provider, makeStore } from './store'
import Layout from './Layout'

// TODO: remove borderTop hack

export interface ChecklistProps {
  descriptor?: IChecklist
  schema?: ISchema
  onCommit?: (descriptor: IChecklist) => void
  onRevert?: (descriptor: IChecklist) => void
}

export default function Checklist(props: ChecklistProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Layout />
    </Provider>
  )
}
