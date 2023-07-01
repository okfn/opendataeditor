import * as React from 'react'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import CreateArticleDialog from './Dialogs/CreateArticle'
import CreateChartDialog from './Dialogs/CreateChart'
import CreateFileDialog from './Dialogs/CreateFile'
import CreateFolderDialog from './Dialogs/CreateFolder'
import CreateDatasetDialog from './Dialogs/CreateDataset'
import CreateScriptDialog from './Dialogs/CreateScript'
import CreateViewDialog from './Dialogs/CreateView'
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
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  createArticle: CreateArticleDialog,
  createChart: CreateChartDialog,
  createFile: CreateFileDialog,
  createFolder: CreateFolderDialog,
  createDataset: CreateDatasetDialog,
  createScript: CreateScriptDialog,
  createView: CreateViewDialog,
  deleteFile: DeleteFileDialog,
  deleteFolder: DeleteFolderDialog,
  fetchFile: FetchFileDialog,
  indexFiles: IndexFilesDialog,
  moveFile: MoveFileDialog,
  moveFolder: MoveFolderDialog,
}
