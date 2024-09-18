import LightTooltip from '../../Parts/Tooltips/Light'
import * as helpers from '../../../helpers'
import * as types from '../../../types'

// TODO: remove colors hard-coding (declare them in settings.ts and use in theme/here)
// TODO: use proper InovuaDatagrid types

export function createColumns(
  schema: types.ISchema,
  report?: types.IReport,
  history?: types.IHistory,
  selection?: types.ITableSelection
) {
  const errorIndex = helpers.createErrorIndex(report)
  const changeIndex = helpers.createChangeIndex(history)

  // Number columns

  const rowNumberColumn = {
    name: '_rowNumber',
    showColumnMenuTool: false,
    sortable: false,
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

  // Data columns

  const dataColumns = []
  for (const field of schema.fields) {
    // TODO: fix this on ther server side -- schema should not have hidden fields
    // Otherwise the _rowNumber and _rowValid are displayed on the table
    if (field.name === '_rowNumber' || field.name === '_rowValid') continue
    let header = field.title || field.name
    const errors = errorIndex.label[field.name]
    if (errors) {
      const error = errors[0]
      // @ts-ignore
      if (error) header = error.label
    }
    dataColumns.push({
      name: field.name,
      header,
      type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
      headerProps:
        field.name in errorIndex.label
          ? // It's not possible to use `useTheme` inside useMemo so we hard-code the color for now
            { style: { color: 'white', background: '#FF7170' } }
          : field.name === selection?.columnName
          ? { style: { color: '#ed6c02' } }
          : undefined,
      render: (context: any) => {
        const { cellProps, data } = context
        let { value } = context
        const rowNumber = data._rowNumber
        const columnName = cellProps.id
        const rowKey = `${rowNumber}`
        const cellKey = `${rowNumber},${columnName}`

        // Selection
        if (selection) {
          if (rowNumber === selection.rowNumber || columnName === selection.columnName) {
            cellProps.style.color = '#ed6c02'
          }
        }

        // Changes
        let change: types.IChange | undefined
        if (rowKey in changeIndex.row) {
          change = changeIndex.row[rowKey]
        } else if (cellKey in changeIndex.cell) {
          change = changeIndex.cell[cellKey]
        }
        if (change) {
          cellProps.style.color = 'black'
          cellProps.style.border = '2px solid gray'
          return value
        }

        // Errors
        let error: types.IError | undefined
        if (rowKey in errorIndex.row) {
          error = errorIndex.row[rowKey][0]
        } else if (cellKey in errorIndex.cell) {
          error = errorIndex.cell[cellKey][0]
        }
        if (error) {
          value = error.cell || value
          cellProps.style.color = 'white'
          cellProps.style.cursor = 'pointer'
          cellProps.style.background = 'red'
          value = (
            <LightTooltip title={error.message}>
              <div>{value}</div>
            </LightTooltip>
          )
        }

        return value
      },
    })
  }

  // Extra columns

  // const extraColumns = []
  // const extraCellErrors = report?.tasks[0]?.errors.filter((e) => e.type === 'extra-cell')

  return [rowNumberColumn, ...dataColumns]
}
