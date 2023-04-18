import * as React from 'react'
import ErrorDialog from './Dialogs/Error'
import SaveAsDialog from './Dialogs/SaveAs'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (dialog) {
    if (dialog.startsWith('error')) return <ErrorDialog />
    if (dialog.startsWith('saveAs')) return <SaveAsDialog />
  }
  return null
}
