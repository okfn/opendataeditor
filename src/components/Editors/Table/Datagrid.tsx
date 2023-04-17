import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { useStore } from './store'
import * as settings from './settings'

export default function Datagrid() {
  const loader = useStore((store) => store.loader)
  const columns = useStore((store) => store.columns)
  const editing = useStore((store) => store.editing)
  const gridRef = useStore((store) => store.gridRef)
  const onChange = useStore((store) => store.onChange)
  const updateState = useStore((store) => store.updateState)

  // Actions

  const handleEditStart = () => {
    updateState({ editing: true })
  }

  const handleEditStop = () => {
    requestAnimationFrame(() => {
      updateState({ editing: false })
      gridRef.current.focus()
    })
  }

  const handleKeyDown = (event: any) => {
    if (editing) return
    const grid = gridRef.current
    let [rowIndex, colIndex] = grid.computedActiveCell
    if (event.key === ' ' || event.key === 'Enter') {
      const column = grid.getColumnBy(colIndex)
      grid.startEdit({ columnId: column.name, rowIndex })
      event.preventDefault()
      return
    }
    if (event.key !== 'Tab') return
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

  const handleEditComplete = (context: any) => {
    const rowNumber = context.rowId
    const fieldName = context.columnId
    // TODO: improve this logic
    const value = ['number'].includes(context.cellProps.type)
      ? parseInt(context.value)
      : context.value
    if (onChange) onChange(rowNumber, fieldName, value)
  }

  // TODO: support copy/paste?
  // TODO: disable selecting row number?
  const handleActiveCellChange = (_context: any) => {
    // console.log(context)
  }

  return (
    <InovuaDatagrid
      pagination={true}
      defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
      idProperty="_rowNumber"
      handle={(grid) => {
        gridRef.current = grid
      }}
      columns={columns}
      dataSource={loader as any}
      editable={!!onChange}
      onKeyDown={handleKeyDown}
      onEditStart={handleEditStart}
      onEditStop={handleEditStop}
      onEditComplete={handleEditComplete}
      onActiveCellChange={handleActiveCellChange}
      style={{ height: '100%', border: 'none' }}
    />
  )
}
