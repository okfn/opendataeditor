import * as React from 'react'
import Table from '../../Editors/Table'
import SpinnerContent from '../Files/Contents/SpinnerContent'
import { useStore } from './store'

export default function Content(props: { height: string }) {
  const table = useStore((state) => state.table)
  const path = useStore((state) => state.file.path)
  const report = useStore((state) => state.file.report)
  const tablePatch = useStore((state) => state.tablePatch)
  const updatePatch = useStore((state) => state.updatePatch)
  const loadTable = useStore((state) => state.loadTable)
  const selectedColumn = useStore((state) => state.selectedColumn)
  const [loading, setLoading] = React.useState(false)
  React.useEffect(() => {
    setLoading(true)
    loadTable().catch(console.error)
    setLoading(false)
  }, [path])
  if (!table) return null
  return loading ? (
    <SpinnerContent />
  ) : (
    <Table
      table={table}
      report={report}
      height={props.height}
      onUpdate={updatePatch}
      tablePatch={tablePatch}
      selectedColumn={selectedColumn}
    />
  )
}
