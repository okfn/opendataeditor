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
  isErrorsView?: boolean
}

export default function Table(props: TableProps) {
  const { report, isErrorsView } = props
  const { fields } = props.table.schema
  const height = props.height || '600px'
  const errorIndex = React.useMemo(() => {
    return createErrorIndex(report)
  }, [report])
  const errorRowPositions = React.useMemo(() => {
    return createErrorRowPositions(report)
  }, [report])
  console.log(errorRowPositions)
  const errorFieldPositions = React.useMemo(() => {
    return createErrorFieldPositions(report)
  }, [report])
  const columns = React.useMemo(() => {
    return fields.map((field, index) => {
      const fieldPosition = index + 1
      return {
        name: field.name,
        header: field.title || field.name,
        type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
        width: isErrorsView && !errorFieldPositions.has(fieldPosition) ? 0 : undefined,
        headerProps:
          fieldPosition in errorIndex.label ? { style: { backgroundColor: 'red' } } : {},
        onRender: (cellProps: any, { rowIndex, columnIndex }: any) => {
          const rowKey = `${rowIndex + 2}`
          const cellKey = `${rowIndex + 2},${columnIndex + 1}`
          if (rowKey in errorIndex.row) cellProps.style.background = 'red'
          if (cellKey in errorIndex.cell) cellProps.style.background = 'red'
        },
        // TODO: support the same for header/label errors
        // TODO: rebase alert to dialoge window or right panel
        cellDOMProps: ({ rowIndex, columnIndex }: any) => {
          let error: IError | null = null
          const rowKey = `${rowIndex + 2}`
          const cellKey = `${rowIndex + 2},${columnIndex + 1}`
          if (rowKey in errorIndex.row) error = errorIndex.row[rowKey][0]
          if (cellKey in errorIndex.cell) error = errorIndex.cell[cellKey][0]
          if (error) {
            return {
              onClick: () => {
                alert(error!.message)
              },
            }
          }
          return {}
        },
      }
    })
  }, [fields, errorIndex, isErrorsView])
  const dataSource = React.useMemo(() => {
    return props.table.rows
  }, [fields, errorIndex, isErrorsView])
  // TODO: idProperty should be table's PK
  return (
    <div style={{ height: '100%', width: '100%' }}>
      <ReactDataGrid
        idProperty="table"
        columns={columns}
        dataSource={dataSource}
        style={{ height, minHeight: height, borderBottom: 'none' }}
      />
    </div>
  )
}

interface IErrorIndex {
  header: IDict<IError[]>
  label: IDict<IError[]>
  row: IDict<IError[]>
  cell: IDict<IError[]>
}

function createErrorIndex(report?: IReport) {
  const errorIndex: IErrorIndex = { header: {}, label: {}, row: {}, cell: {} }
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
    } else if (!error.fieldPosition) {
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

function createErrorRowPositions(report?: IReport) {
  const errorRowPositions = new Set()
  if (!report) return errorRowPositions
  const errorTask = report.tasks[0]
  if (!errorTask) return errorRowPositions
  for (const error of errorTask.errors) {
    if (error.rowPosition) errorRowPositions.add(error.rowPosition)
  }
  return errorRowPositions
}

function createErrorFieldPositions(report?: IReport) {
  const errorFieldPositions = new Set()
  if (!report) return errorFieldPositions
  const errorTask = report.tasks[0]
  if (!errorTask) return errorFieldPositions
  for (const error of errorTask.errors) {
    if (error.fieldPosition) errorFieldPositions.add(error.fieldPosition)
  }
  return errorFieldPositions
}
