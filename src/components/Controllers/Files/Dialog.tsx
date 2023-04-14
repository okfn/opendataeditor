import * as React from 'react'
import CreateDialog from './Dialogs/Create'
import FolderDialog from './Dialogs/Folder'
import LinkDialog from './Dialogs/Link'
import NameDialog from './Dialogs/Name'
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
