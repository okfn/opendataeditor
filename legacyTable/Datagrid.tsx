import '@inovua/reactdatagrid-community/index.css'
import * as React from 'react'
import InovuaDatagrid from '@inovua/reactdatagrid-community'
import { useStore } from './store'
import * as settings from './settings'

export default function Datagrid() {
  const mode = useStore((store) => store.mode)
  const source = useStore((store) => store.source)
  const columns = useStore((store) => store.columns)
  const startEditing = useStore((store) => store.startEditing)
  const saveEditing = useStore((store) => store.saveEditing)
  const stopEditing = useStore((store) => store.stopEditing)
  const readOnly = useStore((store) => store.readOnly)
  const updateState = useStore((store) => store.updateState)
  return (
    <InovuaDatagrid
      key={mode}
      columns={columns}
      dataSource={source as any}
      idProperty="_rowNumber"
      pagination={true}
      editable={!readOnly}
      defaultActiveCell={settings.DEFAULT_ACTIVE_CELL}
      handle={(gridRef) => updateState({ gridRef })}
      onEditStart={startEditing}
      onEditComplete={saveEditing}
      onEditStop={stopEditing}
      style={{ height: '100%', border: 'none' }}
    />
  )
}
