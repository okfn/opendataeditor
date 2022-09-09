import * as React from 'react'
import Datagrid from '../Datagrid'
import { useStore } from './store'

export default function DataView() {
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const updatePatch = useStore((state) => state.updatePatch)
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  if (!table || !report) return null
  return <Datagrid table={table} report={report} onUpdate={updatePatch} />
}
