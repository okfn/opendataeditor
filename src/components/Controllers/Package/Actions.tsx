import * as React from 'react'
import ActionsBar from '../../Parts/Bars/Actions'
import { useStore, selectors } from './store'

export default function Actions() {
  const updateState = useStore((state) => state.updateState)
  const isUpdated = useStore(selectors.isUpdated)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <ActionsBar
      isUpdated={isUpdated}
      onSaveAs={() => updateState({ dialog: 'saveAs' })}
      onRevert={revert}
      onSave={save}
    />
  )
}
