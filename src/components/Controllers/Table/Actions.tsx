import * as React from 'react'
import ActionsBar from '../../Parts/Bars/Actions'
import { useStore, selectors } from './store'

export default function Actions() {
  const setDialog = useStore((state) => state.setDialog)
  const isUpdated = useStore(selectors.isUpdated)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <ActionsBar
      isUpdated={isUpdated}
      onSaveAs={() => setDialog('export/table')}
      onRevert={revert}
      onSave={save}
    />
  )
}
