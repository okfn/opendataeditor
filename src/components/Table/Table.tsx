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
  const columns = props.schema.fields.map((field) => {
    return {
      name: field.name,
      header: field.title || field.name,
      type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
    }
  })
  const dataSource = props.rows as any
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactDataGrid
        idProperty="id"
        columns={columns}
        dataSource={dataSource}
        style={{ height, minHeight: height, borderBottom: 'none' }}
      />
    </div>
  )
}
