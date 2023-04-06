import * as React from 'react'
import SaveAsDialog from './Dialogs/SaveAs'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (dialog) {
    if (dialog.startsWith('saveAs')) return <SaveAsDialog />
  }
  return null
}
