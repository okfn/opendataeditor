import * as React from 'react'
import Datagrid from '../Datagrid'
import { useStore } from './store'

export default function Editor(props: { editable?: boolean }) {
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const tablePatch = useStore((state) => state.tablePatch)
  const updatePatch = useStore((state) => state.updatePatch)
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  if (!table || !report) return null
  return (
    <Datagrid
      table={table}
      report={report}
      onUpdate={props.editable ? updatePatch : undefined}
      tablePatch={tablePatch}
    />
  )
}
