import * as React from 'react'
import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Editor() {
  const schema = useStore((state) => state.record?.resource.schema)
  const report = useStore((state) => state.report)
  const tableLoader = useStore((state) => state.tableLoader)
  const updatePatch = useStore((state) => state.updatePatch)
  const updateState = useStore((state) => state.updateState)
  const mode = useStore((state) => state.mode)
  if (!schema) return null
  if (!report) return null
  return (
    <Table
      loader={tableLoader}
      schema={schema}
      report={report}
      onUpdate={updatePatch}
      onErrorClick={(error) => updateState({ error, dialog: 'error' })}
      mode={mode}
    />
  )
}
