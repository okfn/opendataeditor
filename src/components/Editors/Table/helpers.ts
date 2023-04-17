import { ISchema, IReport, IError } from '../../../interfaces'
import { IErrorIndex } from './interfaces'

// TODO: use proper InovuaDatagrid types
export function createColumns(schema: ISchema, report?: IReport) {
  const errorIndex = createErrorIndex(report)

  const rowNumberColumn = {
    name: '_rowNumber',
    header: '',
    type: 'number',
    width: 60,
    editable: false,
    textAlign: 'center' as any,
    headerAlign: 'center' as any,
    headerProps: { style: { backgroundColor: '#c5cae0' } },
    onRender: (cellProps: any) => {
      cellProps.style.background = '#EBEDF7'
      // cellProps.style.fontWeight = 'bold'
      cellProps.style.color = '#aaa'
    },
  }

  const dataColumns = []
  for (const field of schema.fields) {
    // Otherwise the _rowNumber and _rowValid are displayed on the table
    if (field.name === '_rowNumber' || field.name === '_rowValid') continue
    dataColumns.push({
      name: field.name,
      header: field.title || field.name,
      type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
      headerProps:
        field.name in errorIndex.label
          ? { style: { color: 'white', background: 'red' } }
          : undefined,
      render: (context: any) => {
        let { value } = context
        const { cellProps, data } = context
        const rowKey = `${data._rowNumber}`
        const cellKey = `${data._rowNumber},${cellProps.name}`
        if (rowKey in errorIndex.row) {
          cellProps.style.color = 'white'
          cellProps.style.background = 'red'
        }
        if (cellKey in errorIndex.cell) {
          cellProps.style.color = 'white'
          cellProps.style.background = 'red'
        }
        if (cellKey in errorIndex.cell) value = errorIndex.cell[cellKey][0].cell || ''
        return value
      },
      // TODO: support the same for header/label errors
      // TODO: rebase alert to dialoge window or right panel
      cellDOMProps: (context: any) => {
        const { data, name } = context
        let error: IError | null = null
        const rowKey = `${data._rowNumber}`
        const cellKey = `${data._rowNumber},${name}`
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
    })
  }
  return [rowNumberColumn, ...dataColumns]
}

export function createErrorIndex(report?: IReport) {
  const errorIndex: IErrorIndex = { header: {}, label: {}, row: {}, cell: {} }
  if (!report) return errorIndex
  const errorTask = report.tasks[0]
  if (!errorTask) return errorIndex
  for (const error of errorTask.errors) {
    if (!error.rowNumber && !error.fieldNumber) {
      const headerKey = '1'
      errorIndex.header[headerKey] = errorIndex.header[headerKey] || []
      errorIndex.header[headerKey].push(error)
    } else if (!error.rowNumber) {
      const labelKey = `${error.fieldName}`
      errorIndex.label[labelKey] = errorIndex.label[labelKey] || []
      errorIndex.label[labelKey].push(error)
    } else if (!error.fieldNumber) {
      const rowKey = `${error.rowNumber}`
      errorIndex.row[rowKey] = errorIndex.row[rowKey] || []
      errorIndex.row[rowKey].push(error)
    } else {
      const cellKey = `${error.rowNumber},${error.fieldName}`
      errorIndex.cell[cellKey] = errorIndex.cell[cellKey] || []
      errorIndex.cell[cellKey].push(error)
    }
  }
  return errorIndex
}
