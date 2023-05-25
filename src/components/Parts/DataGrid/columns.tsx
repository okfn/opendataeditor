import * as React from 'react'
import LightTooltip from '../Tooltips/Light'
import { ISchema, IReport, IError, ITablePatch } from '../../../interfaces'
import { IErrorIndex } from './interfaces'

// TODO: use proper InovuaDatagrid types
export function createColumns(schema: ISchema, report?: IReport, _patch?: ITablePatch) {
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
    // TODO: fix this on ther server side -- schema should not have hidden fields
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
        const { cellProps, data } = context
        let { value } = context
        let error: IError | undefined
        const rowKey = `${data._rowNumber}`
        const cellKey = `${data._rowNumber},${cellProps.id}`

        // Row errors
        if (rowKey in errorIndex.row) {
          error = errorIndex.row[rowKey][0]
        }

        // Cell errors
        if (cellKey in errorIndex.cell) {
          error = errorIndex.cell[cellKey][0]
          value = error.cell || ''
        }

        // Errors found
        if (error) {
          cellProps.style.color = 'white'
          cellProps.style.cursor = 'pointer'
          cellProps.style.background = 'red'
          return (
            <LightTooltip title={error.message}>
              <div>{value}</div>
            </LightTooltip>
          )
        }

        return value
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
