import * as React from 'react'
import ActionsBar from '../../Parts/Bars/Actions'
import { useStore } from './store'

export default function Actions() {
  const setDialog = useStore((state) => state.setDialog)
  const tablePatch = useStore((state) => state.tablePatch)
  const revertPatch = useStore((state) => state.revertPatch)
  const commitPatch = useStore((state) => state.commitPatch)
  return (
    <ActionsBar
      isUpdated={!!Object.keys(tablePatch).length}
      onSaveAs={() => setDialog('export/table')}
      onRevert={revertPatch}
      onSave={commitPatch}
    />
  )
}
