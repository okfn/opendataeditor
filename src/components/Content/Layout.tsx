import * as React from 'react'
import Table from '../Table'
import { useStore } from './store'

export default function Layout() {
  const resource = useStore((state) => state.resource)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  if (!resource || !table || !report) return null
  return <Table resource={resource} table={table} report={report} />
}
