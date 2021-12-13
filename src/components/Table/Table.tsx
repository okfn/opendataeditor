import * as React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { ITable } from '../../interfaces'

interface TableProps {
  table: ITable
  height?: string
}

export default function Table(props: TableProps) {
  const height = props.height || '600px'
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactDataGrid
        idProperty="table"
        columns={props.table.schema.fields}
        dataSource={props.table.rows as any}
        style={{ height, minHeight: height, borderBottom: 'none' }}
      />
    </div>
  )
}
