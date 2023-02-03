import * as React from 'react'
import FolderDialog from './Dialogs/FolderDialog'
import NameDialog from './Dialogs/NameDialog'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (dialog) {
    if (dialog.startsWith('folder/')) return <FolderDialog />
    if (dialog.startsWith('name/')) return <NameDialog />
  }
  return null
}
