import * as React from 'react'
import Box from '@mui/material/Box'
import { Provider, makeStore } from './store'
import { useTheme } from '@mui/material/styles'
import '@inovua/reactdatagrid-community/index.css'
import { ITable, ISchema, IReport } from '../../interfaces'
import Actions from './Actions'
import Editor from './Editor'

export interface TableProps {
  name?: string
  table: ITable
  schema: ISchema
  report?: IReport
  source?: string
  height?: string
  updateTable?: (rowNumber: number, fieldName: string, value: any) => void
  isErrorsView?: boolean
}

export default function Table(props: TableProps) {
  const theme = useTheme()
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box sx={{ height: theme.spacing(56) }}>
        <Box sx={{ height: theme.spacing(48), borderTop: 'solid 1px white' }}>
          <Editor />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
