import * as React from 'react'
import AddRemoteFileDialog from './Dialogs/AddRemoteFile'
import AddEmptyFolderDialog from './Dialogs/AddEmptyFolder'
import AddRemoteDatasetDialog from './Dialogs/AddRemoteDataset'
import AdjustFileDialog from './Dialogs/AdjustFile'
import ConfigDialog from './Dialogs/Config'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import CreateDialog from './Dialogs/Create'
import DeleteFileDialog from './Dialogs/DeleteFile'
import DeleteFolderDialog from './Dialogs/DeleteFolder'
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
  addEmptyFolder: AddEmptyFolderDialog,
  addRemoteFile: AddRemoteFileDialog,
  addRemoteDataset: AddRemoteDatasetDialog,
  adjustFile: AdjustFileDialog,
  config: ConfigDialog,
  configProject: ConfigDialog,
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  create: CreateDialog,
  deleteFile: DeleteFileDialog,
  deleteFolder: DeleteFolderDialog,
  indexFiles: IndexFilesDialog,
  moveFile: MoveFileDialog,
  moveFolder: MoveFolderDialog,
}
