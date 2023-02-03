import * as React from 'react'
import Box from '@mui/material/Box'
import InputField from '../../Parts/Fields/InputField'
import Table from '../../Editors/Table'
import { IReport } from '../../../interfaces'
import { useStore } from './store'

export default function Content() {
  return (
    <Box sx={{ padding: 2 }}>
      <Query />
      <Result />
    </Box>
  )
}

function Query() {
  const query = useStore((state) => state.query)
  const setQuery = useStore((state) => state.setQuery)
  return <InputField label="Query" value={query} onChange={(query) => setQuery(query)} />
}

function Result() {
  const table = useStore((state) => state.table)
  // TODO: it's a stub
  // @ts-ignore
  const report: IReport = { valid: true, tasks: [], warnings: [], errors: [] }
  if (!table) return null
  return (
    <Box sx={{ mt: 2 }}>
      <Table table={table} report={report} height="610px" />
    </Box>
  )
}
