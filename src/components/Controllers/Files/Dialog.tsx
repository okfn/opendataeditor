import * as React from 'react'
import CreateDialog from './Dialogs/CreateDialog'
import FolderDialog from './Dialogs/FolderDialog'
import LinkDialog from './Dialogs/LinkDialog'
import NameDialog from './Dialogs/NameDialog'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (dialog) {
    if (dialog.startsWith('folder/')) return <FolderDialog />
    if (dialog.startsWith('name/')) return <NameDialog />
    if (dialog.startsWith('link/')) return <LinkDialog />
    if (dialog.startsWith('create/')) return <CreateDialog />
  }
  return null
}
