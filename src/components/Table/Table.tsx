import * as React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { ITable, IReport, IDict } from '../../interfaces'

// NOTE:
// ---
// Currently, we use a simplified connection between report and table
// We rely on row/columnIndex provided by the ReactDataGrid API although
// in general it will not match row/fieldPosition we use in Frictionless
// because a header can be not on the first row etc
// ---
// A proper implementation should be based on `frictionless extract` returning
// a Table object where rows has their context (rowPosition, errors, blank etc)
// provided as a `_row` property. We need to implement it in frictionless@5
// When it's implemented we don't need to take `report` as a prop

interface TableProps {
  table: ITable
  report?: IReport
  height?: string
}

export default function Table(props: TableProps) {
  const { report } = props
  const { fields } = props.table.schema
  const height = props.height || '600px'
  const errorIndex = React.useMemo(() => {
    return createErrorIndex(report)
  }, [report])
  const columns = React.useMemo(() => {
    return fields.map((field) => {
      return {
        name: field.name,
        header: field.title || field.name,
        type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
        onRender: (cellProps: any, context: any) => {
          const {rowIndex, columnIndex} = context
          const key = `${rowIndex+1},${columnIndex+1}`
          console.log(key)
          if (key in errorIndex) cellProps.style.background = 'red'
        },
      }
    })
  }, [fields, errorIndex])
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

function createErrorIndex(report?: IReport) {
  const errorIndex = {} as IDict
  if (!report) return errorIndex
  const errorTask = report.tasks[0]
  if (!errorTask) return errorIndex
  for (const error of errorTask.errors) {
    // TODO: support not only cell errors
    if (!error.rowPosition) continue
    if (!error.fieldPosition) continue
    const key = `${error.rowPosition},${error.fieldPosition}`
    errorIndex[key] = error
  }
  return errorIndex
}
