import * as React from 'react'
import LinkDialog from './Dialogs/Link'
import NameDialog from './Dialogs/Name'
import PathDialog from './Dialogs/Path'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (dialog) {
    if (dialog.startsWith('link/')) return <LinkDialog />
    if (dialog.startsWith('name/')) return <NameDialog />
    if (dialog.startsWith('path/')) return <PathDialog />
  }
  return null
}
