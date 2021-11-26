import * as React from 'react'
import create from 'zustand'
import createContext from 'zustand/context'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
// import ButtonGroup from '@mui/material/ButtonGroup'
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
      <Actions />
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
    <div style={{ height: 540, width: '100%' }}>
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

function Actions() {
  const toggleIsSource = useStore((state) => state.toggleIsSource)
  const exporter = useStore((state) => state.exporter)
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            title="Export data as CSV"
            onClick={exporter}
            fullWidth
          >
            Export
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            title="Show data as CSV"
            onClick={() => toggleIsSource()}
            fullWidth
          >
            Source
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
