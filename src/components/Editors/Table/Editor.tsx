import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Datagrid from '../Datagrid'
import { useStore } from './store'

export default function Editor(props: { editable?: boolean }) {
  const path = useStore((state) => state.path)
  const table = useStore((state) => state.table)
  const report = useStore((state) => state.report)
  const tablePatch = useStore((state) => state.tablePatch)
  const updatePatch = useStore((state) => state.updatePatch)
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [path])
  if (!table || !report) return null
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6 + (props.editable ? 8 : 56))})`
  return (
    <Datagrid
      table={table}
      report={report}
      height={height}
      onUpdate={props.editable ? updatePatch : undefined}
      tablePatch={tablePatch}
    />
  )
}
