import * as React from 'react'
import Box from '@mui/material/Box'
import { Provider, makeStore } from './store'
import '@inovua/reactdatagrid-community/index.css'
import { ITable, ISchema, IReport } from '../../interfaces'
import Actions from './Actions'
import Content from './Content'

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
  return (
    <Provider createStore={() => makeStore(props)}>
      <Box>
        <Box sx={{ borderTop: 'solid 1px white' }}>
          <Content />
        </Box>
        <Box>
          <Actions />
        </Box>
      </Box>
    </Provider>
  )
}
