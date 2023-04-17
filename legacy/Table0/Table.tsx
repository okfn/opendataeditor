import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import ReactDataGrid from '@inovua/reactdatagrid-community'
import { ThemeProvider } from '@mui/material/styles'
import * as themes from '../../../themes'
import { IReport, IError, IDict } from '../../../interfaces'
import { ISchema, ITableLoader } from '../../../interfaces'

// NOTE:
// The code here is very prototypy!
// ---
// Currently, we use a simplified connection between report and table
// We rely on row/columnIndex provided by the ReactDataGrid API although
// in general it will not match row/fieldNumber we use in Frictionless
// because a header can be not on the first row etc. Also, we don't show
// extra cells ATM because `frictionless extract` doesn't return this data
// ---
// A proper implementation should be based on `frictionless extract` returning
// a Table object where rows has their context (rowNumber, errors, blank etc)
// provided as a `_row` property. We need to implement it in frictionless@5
// When it's implemented we don't need to take `report` as a prop

// TODO: move to state
// https://reactdatagrid.io/docs/miscellaneous#excel-like-cell-navigation-and-edit
let inEdit: boolean
const DEFAULT_ACTIVE_CELL: [number, number] = [0, 1]

export interface TableProps {
  loader: ITableLoader
  schema: ISchema
  report: IReport
  height?: string
  onChange?: (rowNumber: number, fieldName: string, value: any) => void
  selectedColumn?: number
}

export default function Table(props: TableProps) {
  const [gridRef, setGridRef] = React.useState(null)

  // Errors

  const errorIndex = React.useMemo(() => {
    return createErrorIndex(props.report)
  }, [props.report])

  // Columns

  const columns = React.useMemo(() => {
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

    const headerColor = (columnIndex: number, columnName: string) => {
      if (columnName in errorIndex.label) {
        return { style: { color: 'white', background: 'red' } }
      }
      if (columnIndex === props.selectedColumn) {
        return { style: { backgroundColor: 'lightgreen' } }
      }
      return {}
    }

    const columns = []
    for (const [key, field] of Object.entries(props.schema.fields)) {
      const columnIndex = parseInt(key) + 1
      // Otherwise the _rowNumber and _rowValid are displayed on the table
      if (field.name === '_rowNumber' || field.name === '_rowValid') continue
      columns.push({
        name: field.name,
        header: field.title || field.name,
        type: ['integer', 'number'].includes(field.type) ? 'number' : 'string',
        headerProps: headerColor(columnIndex, field.name),
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
          if (context.columnIndex === props.selectedColumn) {
            cellProps.style.background = 'lightGreen'
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

    return [rowNumberColumn, ...columns]
  }, [props.schema.fields, errorIndex, props.selectedColumn])

  // Actions

  const onEditStart = () => {
    inEdit = true
  }

  const onEditStop = () => {
    requestAnimationFrame(() => {
      inEdit = false
      // @ts-ignore
      gridRef.current.focus()
    })
  }

  const onKeyDown = (event: any) => {
    if (inEdit) {
      return
    }
    // @ts-ignore
    const grid = gridRef.current
    let [rowIndex, colIndex] = grid.computedActiveCell

    if (event.key === ' ' || event.key === 'Enter') {
      const column = grid.getColumnBy(colIndex)
      grid.startEdit({ columnId: column.name, rowIndex })
      event.preventDefault()
      return
    }
    if (event.key !== 'Tab') {
      return
    }
    event.preventDefault()
    event.stopPropagation()

    const direction = event.shiftKey ? -1 : 1

    const columns = grid.visibleColumns
    const rowCount = grid.count

    colIndex += direction
    if (colIndex === -1) {
      colIndex = columns.length - 1
      rowIndex -= 1
    }
    if (colIndex === columns.length) {
      rowIndex += 1
      colIndex = 0
    }
    if (rowIndex < 0 || rowIndex === rowCount) {
      return
    }

    grid.setActiveCell([rowIndex, colIndex])
  }

  const onEditComplete = (context: any) => {
    const rowNumber = context.rowId
    const fieldName = context.columnId
    // TODO: improve this logic
    const value = ['number'].includes(context.cellProps.type)
      ? parseInt(context.value)
      : context.value
    if (props.onChange) props.onChange(rowNumber, fieldName, value)
  }

  // TODO: support copy/paste?
  // TODO: disable selecting row number?
  const onActiveCellChange = (_context: any) => {
    // console.log(context)
  }

  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <ReactDataGrid
        pagination={true}
        defaultActiveCell={DEFAULT_ACTIVE_CELL}
        idProperty="_rowNumber"
        handle={setGridRef as any}
        columns={columns}
        dataSource={props.loader as any}
        editable={!!props.onChange}
        onKeyDown={onKeyDown}
        onEditStart={onEditStart}
        onEditStop={onEditStop}
        onEditComplete={onEditComplete}
        onActiveCellChange={onActiveCellChange}
        style={{ height: props.height || '100%', border: 'none' }}
      />
    </ThemeProvider>
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
