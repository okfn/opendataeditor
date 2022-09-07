import * as React from 'react'
import Table from '../Table'
import { useStore } from './store'

export default function Data() {
  const resource = useStore((state) => state.resource)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const loadEverything = useStore((state) => state.loadEverything)
  const toggleMetadataOpen = useStore((state) => state.toggleMetadataOpen)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  if (!resource || !table || !report) return null
  return (
    <Table
      table={table}
      schema={resource.schema!}
      report={report}
      onMetadataClick={toggleMetadataOpen}
    />
  )
}
