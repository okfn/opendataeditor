import * as React from 'react'
import LightTooltip from '../Tooltips/Light'
import * as types from '../../../types'
import { IErrorIndex, IPatchIndex } from './types'

// TODO: use proper InovuaDatagrid types
export function createColumns(
  schema: types.ISchema,
  report?: types.IReport,
  patch?: types.ITablePatch
) {
  const errorIndex = createErrorIndex(report)
  const patchIndex = createPatchIndex(patch)

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
        const rowKey = `${data._rowNumber}`
        const cellKey = `${data._rowNumber},${cellProps.id}`

        // Find changes
        let change: types.ITableChange | undefined
        if (rowKey in patchIndex.row) {
          change = patchIndex.row[rowKey]
        } else if (cellKey in patchIndex.cell) {
          change = patchIndex.cell[cellKey]
        }

        // Render change
        if (change) {
          cellProps.style.background = 'yellow'
          console.log(cellProps)
          return value
        }

        // Find errors
        let error: types.IError | undefined
        if (rowKey in errorIndex.row) {
          error = errorIndex.row[rowKey][0]
        } else if (cellKey in errorIndex.cell) {
          error = errorIndex.cell[cellKey][0]
        }

        // Render error
        if (error) {
          value = error.cell || value
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

function createErrorIndex(report?: types.IReport) {
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

function createPatchIndex(patch?: types.ITablePatch) {
  const patchIndex: IPatchIndex = { header: {}, label: {}, row: {}, cell: {} }
  if (!patch) return patchIndex
  for (const change of patch.changes) {
    if (change.type === 'delete-row') {
      const rowKey = `${change.rowNumber}`
      patchIndex.row[rowKey] = change
    } else if (change.type === 'update-cell') {
      const cellKey = `${change.rowNumber},${change.fieldName}`
      patchIndex.cell[cellKey] = change
    }
  }
  return patchIndex
}
