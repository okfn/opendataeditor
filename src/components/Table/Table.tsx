import * as React from 'react'
import create from 'zustand'
import createContext from 'zustand/context'
import Box from '@mui/material/Box'
import { DataGrid } from '@mui/x-data-grid'
import { ISchema, IRow } from '../../interfaces'

// TODO: add buttons to show metrics (min/max/average/etc)?

interface TableProps {
  schema: ISchema
  rows: IRow
  // TODO: make optional
  text: string
}

interface TableState {
  schema: ISchema
  rows: IRow
  text: string
  isSource?: boolean
  toggleIsSource: () => void
  exporter: () => void
}

function makeStore(props: TableProps) {
  return create<TableState>((set, get) => ({
    schema: props.schema,
    rows: props.rows,
    text: props.text,
    toggleIsSource: () => set({ isSource: !get().isSource }),
    exporter: () => {
      console.log('export')
    },
  }))
}

const { Provider, useStore } = createContext<TableState>()
export default function Table(props: TableProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Content />
    </Provider>
  )
}

function Content() {
  const isSource = useStore((state) => state.isSource)
  return isSource ? <FileView /> : <TableView />
}

function TableView() {
  const rows = useStore((state) => state.rows)
  const schema = useStore((state) => state.schema)
  const gridRows = rows.map((row: any, index: number) => ({ ...row, id: index }))
  const gridFields = schema.fields.map((field: any) => {
    return {
      field: field.name,
      headerName: field.title || field.name,
      // TODO: extend the mapping
      type: field.type === 'number' ? 'number' : 'string',
    }
  })
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <DataGrid
        rows={gridRows}
        columns={gridFields}
        rowsPerPageOptions={[5]}
        sortingOrder={['desc', 'asc', null]}
        disableSelectionOnClick
      />
    </div>
  )
}

function FileView() {
  const text = useStore((state) => state.text)
  return (
    <Box sx={{ height: 540, width: '100%', overflow: 'auto' }}>
      <pre style={{ marginTop: 0 }}>
        <code>{text}</code>
      </pre>
    </Box>
  )
}
