import * as React from 'react'
import DataGrid from '../../Parts/DataGrid'
import { useStore } from './store'

export default function Editor() {
  const schema = useStore((state) => state.record?.resource.schema)
  const report = useStore((state) => state.report)
  const loader = useStore((state) => state.loader)
  const patch = useStore((state) => state.patch)
  const startEditing = useStore((state) => state.startEditing)
  const saveEditing = useStore((state) => state.saveEditing)
  const stopEditing = useStore((state) => state.stopEditing)
  const updateState = useStore((state) => state.updateState)
  if (!schema) return null
  if (!report) return null
  return (
    <DataGrid
      source={loader}
      schema={schema}
      report={report}
      patch={patch}
      editable={true}
      onEditStart={startEditing}
      onEditComplete={saveEditing}
      onEditStop={stopEditing}
      handle={(gridRef) => updateState({ gridRef })}
    />
  )
}
