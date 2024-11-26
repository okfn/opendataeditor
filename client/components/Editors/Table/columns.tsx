import type { TypeColumn } from '@inovua/reactdatagrid-community/types'
import Box from '@mui/material/Box'
import * as helpers from '../../../helpers'
import * as types from '../../../types'
import LightTooltip from '../../Parts/Tooltips/Light'

// TODO: remove colors hard-coding (declare them in settings.ts and use in theme/here)

export function createColumns(props: {
  schema: types.ISchema
  report: types.IReport
  errorIndex: types.IErrorIndex
  errorRowNumbers: number[]
  history: types.IHistory
  selection?: types.ITableSelection
  colorPalette?: any
}) {
  const {
    schema,
    report,
    errorIndex,
    errorRowNumbers,
    history,
    selection,
    colorPalette,
  } = props

  const changeIndex = helpers.createChangeIndex(history)

  // Row number column

  const rowNumberColumn: IColumn = {
    name: '_rowNumber',
    showColumnMenuTool: false,
    sortable: false,
    header: '',
    type: 'number',
    width: 60,
    editable: false,
    textAlign: 'center',
    headerAlign: 'center',
    headerProps: { style: { backgroundColor: '#c5cae0' } },
    onRender: (cellProps) => {
      const { value } = cellProps

      cellProps.style.color = '#aaa'
      cellProps.style.background = '#EBEDF7'

      if (errorRowNumbers.includes(value)) {
        cellProps.style.color = 'white'
        cellProps.style.background = colorPalette.OKFNRed400.main
      }
    },
  }

  // Data columns

  const dataColumns: IColumn[] = []
  const dataFields = getDataFields({ schema, report })
  for (const field of dataFields) {
    const labelErrors = errorIndex.label[field.name]
    const columnType = ['integer', 'number'].includes(field.type) ? 'number' : 'string'

    const renderHeader: IColumn['header'] = () => {
      const firstError = labelErrors?.[0]
      const label = firstError ? firstError.label : field.name

      if (firstError) {
        return (
          <LightTooltip title={firstError.message}>
            <Box sx={{ minWidth: '80%', minHeight: '20px' }}>{label}</Box>
          </LightTooltip>
        )
      }

      return label
    }

    const renderRow: IColumn['render'] = (context) => {
      const { cellProps, data } = context
      let { value } = context
      const rowNumber = data._rowNumber
      const columnName = cellProps.id
      const rowKey = `${rowNumber}`
      const cellKey = `${rowNumber},${columnName}`

      // Value
      if (columnType === 'string') {
        value = value?.toString()
      }

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
        cellProps.style.border = '1px solid ' + colorPalette.OKFNBlue.main
        cellProps.style.backgroundColor = colorPalette.OKFNGray100.main
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
        cellProps.style.background = colorPalette.OKFNRed400.main
        value = (
          <LightTooltip title={error.message}>
            <Box sx={{ minWidth: '80%', minHeight: '20px' }}>{value}</Box>
          </LightTooltip>
        )
      }

      return value
    }

    dataColumns.push({
      name: field.name,
      header: renderHeader,
      type: columnType,
      editable: !field.isExtra,
      headerProps: labelErrors
        ? { style: { color: 'white', background: colorPalette.OKFNRed400.main } }
        : field.name === selection?.columnName
        ? { style: { color: '#ed6c02' } }
        : undefined,
      render: renderRow,
    })
  }

  return [rowNumberColumn, ...dataColumns]
}

export function getDataFields(props: { schema: types.ISchema; report?: types.IReport }) {
  const task = props.report?.tasks[0]
  const fields: IDataField[] = []

  for (const field of props.schema.fields) {
    // TODO: fix this on ther server side -- schema should not have hidden fields
    // Otherwise the _rowNumber and _rowValid are displayed on the table
    if (field.name === '_rowNumber' || field.name === '_rowValid') continue
    fields.push({
      name: field.name,
      type: field.type,
      title: field.title,
    })
  }

  const extraCellErrors = task?.errors.filter((e) => e.type === 'extra-cell')
  const extraFieldNumbers = new Set(extraCellErrors?.map((e) => e.fieldNumber))
  for (const fieldNumber of extraFieldNumbers) {
    if (!fieldNumber || fields[fieldNumber]) continue
    fields.push({
      name: `_fieldNumber${fieldNumber}`,
      type: 'string',
      title: '',
      isExtra: true,
    })
  }

  return fields
}

type IDataField = {
  name: string
  type: string
  title?: string
  isExtra?: boolean
}

// It fixes the native TypeColumn type to match the docs and actual behavior
type IColumn = TypeColumn & {
  showColumnMenuTool?: boolean
  onRender?: (cellProps: any) => void
}
