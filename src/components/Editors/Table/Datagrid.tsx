import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { useStore } from './store'
import * as settings from './settings'

export default function Datagrid() {
  const mode = useStore((store) => store.mode)
  const loader = useStore((store) => store.loader)
  const columns = useStore((store) => store.columns)
  const editing = useStore((store) => store.editing)
  const gridRef = useStore((store) => store.gridRef)
  const readOnly = useStore((store) => store.readOnly)
  const onUpdate = useStore((store) => store.onUpdate)
  const updateState = useStore((store) => store.updateState)

  // Actions

  const handleEditStart = () => {
    updateState({ editing: true })
  }

  const handleKeyDown = (event: any) => {
    if (!editing) return
    const grid = gridRef?.current
    if (!grid) return
    const cell = grid.computedActiveCell
    if (!cell) return

    // Start editing
    let [rowIndex, colIndex] = cell
    if (event.key === ' ' || event.key === 'Enter') {
      const column = grid.getColumnBy(colIndex)
      if (grid.startEdit && column.name) {
        grid.startEdit({ columnId: column.name, rowIndex })
      }
      event.preventDefault()
      return
    }

    // Navigate cells
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
    if (!editing) return

    // Write editing
    const rowNumber = context.rowId
    const fieldName = context.columnId
    let value = context.value
    if (context.cellProps.type === 'number') {
      value = parseInt(value)
    }
    if (onUpdate) onUpdate(rowNumber, fieldName, value)
  }

  const handleEditStop = () => {
    const grid = gridRef?.current
    if (!grid) return

    // Stop editing
    requestAnimationFrame(() => {
      updateState({ editing: false })
      grid.focus()
    })
  }

  // Render

  return (
    <InovuaDatagrid
      key={mode}
      pagination={true}
      editable={!readOnly}
      defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
      idProperty="_rowNumber"
      onReady={(gridRef) => updateState({ gridRef })}
      columns={columns}
      dataSource={loader as any}
      onKeyDown={handleKeyDown}
      onEditStart={handleEditStart}
      onEditStop={handleEditStop}
      onEditComplete={handleEditComplete}
      style={{ height: '100%', border: 'none' }}
    />
  )
}
