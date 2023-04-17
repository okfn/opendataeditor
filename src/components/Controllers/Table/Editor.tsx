import * as React from 'react'
import Table from '../../Editors/Table'
import { useStore } from './store'

export default function Editor() {
  const schema = useStore((state) => state.file?.record?.resource.schema)
  const report = useStore((state) => state.file?.record?.report)
  const loadTable = useStore((state) => state.loadTable)
  const updatePatch = useStore((state) => state.updatePatch)
  if (!schema) return null
  if (!report) return null
  return (
    <Table loader={loadTable} schema={schema} report={report} onChange={updatePatch} />
  )
}
