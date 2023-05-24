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

  const handleEditComplete = (context: any) => {
    if (!editing) return

    // Write editing
    const rowNumber = context.rowId
    const fieldName = context.columnId
    let value = context.value
    if (context.cellProps.type === 'number') value = parseInt(value)
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
      onEditStart={handleEditStart}
      onEditComplete={handleEditComplete}
      onEditStop={handleEditStop}
      style={{ height: '100%', border: 'none' }}
    />
  )
}
