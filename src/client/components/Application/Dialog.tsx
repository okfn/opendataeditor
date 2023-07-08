import * as React from 'react'
import ConfigDialog from './Dialogs/Config'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import CreateFileDialog from './Dialogs/CreateFile'
import CreateFolderDialog from './Dialogs/CreateFolder'
import DeleteFileDialog from './Dialogs/DeleteFile'
import DeleteFolderDialog from './Dialogs/DeleteFolder'
import FetchFileDialog from './Dialogs/FetchFile'
import IndexFilesDialog from './Dialogs/IndexFiles'
import MoveFileDialog from './Dialogs/MoveFile'
import MoveFolderDialog from './Dialogs/MoveFolder'
import { useStore } from './store'

export default function Dialog() {
  const dialog = useStore((state) => state.dialog)
  if (!dialog) return null
  const Dialog = DIALOGS[dialog]
  return <Dialog />
}

const DIALOGS = {
  config: ConfigDialog,
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  createFile: CreateFileDialog,
  createFolder: CreateFolderDialog,
  deleteFile: DeleteFileDialog,
  deleteFolder: DeleteFolderDialog,
  fetchFile: FetchFileDialog,
  indexFiles: IndexFilesDialog,
  moveFile: MoveFileDialog,
  moveFolder: MoveFolderDialog,
}
