import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { ISchema, IRow } from '../../interfaces'

// TODO: add buttons to show metrics (min/max/average/etc)?

interface TableProps {
  schema: ISchema
  rows: IRow
}

export default function Table(props: TableProps) {
  const rows = props.rows.map((row: any, index: number) => ({ ...row, id: index }))
  const columns = props.schema.fields.map((field: any) => {
    return {
      field: field.name,
      headerName: field.title || field.name,
      // TODO: extend the mapping
      type: field.type === 'number' ? 'number' : 'string',
    }
  })
  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[5]}
        sortingOrder={['desc', 'asc', null]}
        disableSelectionOnClick
      />
    </div>
  )
}
