import * as React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { ISchema, IRow } from '../../interfaces'

interface TableProps {
  schema: ISchema
  rows: IRow
  height?: string
}

export default function Table(props: TableProps) {
  const height = props.height || '600px'
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactDataGrid
        idProperty="table"
        columns={props.schema.fields}
        dataSource={props.rows as any}
        style={{ height, minHeight: height, borderBottom: 'none' }}
      />
    </div>
  )
}
