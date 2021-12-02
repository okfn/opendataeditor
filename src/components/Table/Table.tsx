import * as React from 'react'
import { DataGrid } from '@mui/x-data-grid'
import { ISchema, IRow } from '../../interfaces'

interface TableProps {
  schema: ISchema
  rows: IRow
}

export default function Table(props: TableProps) {
  const gridRows = props.rows.map((row: any, index: number) => ({ ...row, id: index }))
  const gridFields = props.schema.fields.map((field: any) => {
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
