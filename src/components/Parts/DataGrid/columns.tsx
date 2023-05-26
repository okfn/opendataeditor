import * as React from 'react'
import LightTooltip from '../Tooltips/Light'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

// TODO: use proper InovuaDatagrid types
export function createColumns(
  schema: types.ISchema,
  report?: types.IReport,
  patch?: types.ITablePatch
) {
  const errorIndex = helpers.createErrorIndex(report)
  const patchIndex = helpers.createPatchIndex(patch)

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
