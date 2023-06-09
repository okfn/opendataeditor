import * as React from 'react'
import LinkDialog from './Dialogs/Link'
import NameDialog from './Dialogs/Name'
import PathDialog from './Dialogs/Path'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (!dialog) return null
  const Dialog = DIALOGS[dialog]
  return <Dialog />
}

const DIALOGS = {
  uploadLink: LinkDialog,
  createFolder: NameDialog,
  copyFile: PathDialog,
  copyFolder: PathDialog,
  moveFile: PathDialog,
  moveFolder: PathDialog,
}
