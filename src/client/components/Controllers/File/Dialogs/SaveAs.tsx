import * as React from 'react'
import SaveAsDialog from '../../Base/Dialogs/SaveAs'
import { useStore } from '../store'

export default function SaveAs() {
  const path = useStore((state) => state.path)
  const saveAs = useStore((state) => state.saveAs)
  const updateState = useStore((state) => state.updateState)
  return (
    <SaveAsDialog
      path={path}
      onSave={saveAs}
      onClose={() => updateState({ dialog: undefined })}
    />
  )
}
