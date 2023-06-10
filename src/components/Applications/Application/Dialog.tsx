import * as React from 'react'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import CreateFolderDialog from './Dialogs/CreateFolder'
import MoveFileDialog from './Dialogs/MoveFile'
import MoveFolderDialog from './Dialogs/MoveFolder'
import UploadLinkDialog from './Dialogs/UploadLink'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (!dialog) return null
  const Dialog = DIALOGS[dialog]
  return <Dialog />
}

const DIALOGS = {
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  createFolder: CreateFolderDialog,
  moveFile: MoveFileDialog,
  moveFolder: MoveFolderDialog,
  uploadLink: UploadLinkDialog,
}
