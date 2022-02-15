import * as React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { ITable } from '../../interfaces'

interface TableProps {
  table: ITable
  height?: string
}

export default function Table(props: TableProps) {
  const { fields } = props.table.schema
  const height = props.height || '600px'
  const columns = React.useMemo(() => {
    return fields.map((field) => {
      return {
        name: field.name,
        header: field.title || field.name,
        type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
      }
    })
  }, [fields])
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactDataGrid
        idProperty="table"
        columns={columns}
        dataSource={props.table.rows as any}
        style={{ height, minHeight: height, borderBottom: 'none' }}
      />
    </div>
  )
}
