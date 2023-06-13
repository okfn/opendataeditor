import * as React from 'react'
import Box from '@mui/material/Box'
import Alert from '@mui/material/Alert'
// import Table from '../../Editors/Table'
import { useStore } from './store'
import * as types from '../../../types'

export default function Viewer() {
  const error = useStore((state) => state.error)
  const table = useStore((state) => state.table)

  // TODO: it's a stub
  // @ts-ignore
  const report: types.IReport = { valid: true, tasks: [], warnings: [], errors: [] }
  if (!table) {
    if (error) {
      return (
        <React.Fragment>
          <Box
            display="flex"
            width="100%"
            height="100%"
            alignItems="center"
            justifyContent="center"
          >
            <Alert sx={{ margin: 2 }} severity="error">
              {error}
            </Alert>
          </Box>
        </React.Fragment>
      )
    } else {
      return null
    }
  }

  // TODO: recover
  console.log(report)
  return null
  // <React.Fragment>
  // <Table table={table} report={report} />
  // </React.Fragment>
}
