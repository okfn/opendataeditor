import * as React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import '@inovua/reactdatagrid-community/index.css'
import { ITable, IReport, IError, IDict } from '../../interfaces'

// NOTE:
// ---
// Currently, we use a simplified connection between report and table
// We rely on row/columnIndex provided by the ReactDataGrid API although
// in general it will not match row/fieldPosition we use in Frictionless
// because a header can be not on the first row etc. Also, we don't show
// extra cells ATM because `frictionless extract` doesn't return this data
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
    return fields.map((field, index) => {
      const fieldPosition = index + 1
      return {
        name: field.name,
        header: field.title || field.name,
        type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
        headerProps: fieldPosition in errorIndex.label ? {style: {backgroundColor: 'red'}} : {},
        render: ({value, cellProps, rowIndex, columnIndex}: any) => {
          const rowKey = `${rowIndex + 2}`
          const cellKey = `${rowIndex + 2},${columnIndex + 1}`
          if (rowKey in errorIndex.row) cellProps.style.background = 'red'
          if (cellKey in errorIndex.cell) cellProps.style.background = 'red'
          console.log(cellProps)
          return value
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

interface IErrorIndex {
  header: IDict<IError[]>,
  label: IDict<IError[]>,
  row: IDict<IError[]>,
  cell: IDict<IError[]>
}

function createErrorIndex(report?: IReport) {
  const errorIndex: IErrorIndex = {header: {}, label: {}, row: {}, cell: {}}
  if (!report) return errorIndex
  const errorTask = report.tasks[0]
  if (!errorTask) return errorIndex
  for (const error of errorTask.errors) {
    if (!error.rowPosition && !error.fieldPosition) {
      const headerKey = '1'
      errorIndex.header[headerKey] = errorIndex.header[headerKey] || []
      errorIndex.header[headerKey].push(error)
    } else if (!error.rowPosition) {
      const labelKey = `${error.fieldPosition}`
      errorIndex.label[labelKey] = errorIndex.label[labelKey] || []
      errorIndex.label[labelKey].push(error)
    } else if (!error.fieldPosition)  {
      const rowKey = `${error.rowPosition}`
      errorIndex.row[rowKey] = errorIndex.row[rowKey] || []
      errorIndex.row[rowKey].push(error)
    } else {
      const cellKey = `${error.rowPosition},${error.fieldPosition}`
      errorIndex.cell[cellKey] = errorIndex.cell[cellKey] || []
      errorIndex.cell[cellKey].push(error)
    }
  }
  return errorIndex
}
