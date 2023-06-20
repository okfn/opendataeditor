import * as React from 'react'
import SaveAs from '../../../Parts/Dialogs/SaveAs'
import { useStore } from '../store'

export default function SaveAsDialog() {
  const path = useStore((state) => state.path)
  const saveAs = useStore((state) => state.saveAs)
  const updateState = useStore((state) => state.updateState)
  return (
    <SaveAs
      path={path}
      onSave={saveAs}
      onClose={() => updateState({ dialog: undefined })}
    />
  )
}
