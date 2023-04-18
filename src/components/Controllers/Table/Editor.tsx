import * as React from 'react'
import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Editor() {
  const schema = useStore((state) => state.file?.record?.resource.schema)
  const report = useStore((state) => state.file?.record?.report)
  const tableLoader = useStore((state) => state.tableLoader)
  const updatePatch = useStore((state) => state.updatePatch)
  const mode = useStore((state) => state.mode)
  if (!schema) return null
  if (!report) return null
  return (
    <Table
      loader={tableLoader}
      schema={schema}
      report={report}
      onChange={updatePatch}
      mode={mode}
    />
  )
}
