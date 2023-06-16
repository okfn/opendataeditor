import * as React from 'react'
import DataGrid from '../../Parts/DataGrid'
import { useStore } from './store'

export default function Editor() {
  const schema = useStore((state) => state.record?.resource.schema)
  const report = useStore((state) => state.report)
  const loader = useStore((state) => state.loader)
  const history = useStore((state) => state.history)
  const selection = useStore((state) => state.selection)
  const startEditing = useStore((state) => state.startEditing)
  const saveEditing = useStore((state) => state.saveEditing)
  const stopEditing = useStore((state) => state.stopEditing)
  const updateState = useStore((state) => state.updateState)
  if (!schema) return null
  if (!report) return null
  return (
    <DataGrid
      editable
      source={loader}
      schema={schema}
      report={report}
      history={history}
      selection={selection}
      onEditStart={startEditing}
      onEditComplete={saveEditing}
      onEditStop={stopEditing}
      handle={(gridRef) => updateState({ gridRef })}
    />
  )
}
