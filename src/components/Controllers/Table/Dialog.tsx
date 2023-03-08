import * as React from 'react'
import ExportDialog from './Dialogs/ExportDialog'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (dialog) {
    if (dialog.startsWith('export/')) return <ExportDialog />
  }
  return null
}
