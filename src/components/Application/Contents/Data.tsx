import * as React from 'react'
import { assert } from 'ts-essentials'
import Report from '../../Report'
import Table from '../../Table'
import File from '../../File'
import { useStore } from '../store'

export default function Data() {
  const isSourceView = useStore((state) => state.isSourceView)
  const isReportView = useStore((state) => state.isReportView)
  const resource = useStore((state) => state.resource)
  const rows = useStore((state) => state.rows)
  const text = useStore((state) => state.text)
  const report = useStore((state) => state.report)
  assert(resource)
  assert(rows)
  // TODO: text might not be available while it will be still correct state
  assert(text)
  assert(report)
  if (isSourceView) return <File text={text} />
  if (isReportView) return <Report report={report} />
  return <Table schema={resource.schema} rows={rows} />
}
