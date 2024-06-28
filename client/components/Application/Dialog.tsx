import AddRemoteFileDialog from './Dialogs/AddRemoteFile'
import AddEmptyFolderDialog from './Dialogs/AddEmptyFolder'
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
import * as store from '@client/store'

export default function Dialog() {
  const dialog = store.useStore((state) => state.main.dialog)
  if (!dialog) return null
  // @ts-ignore
  const Dialog = DIALOGS[dialog]
  return <Dialog />
}

const DIALOGS = {
  addEmptyFolder: AddEmptyFolderDialog,
  addRemoteFile: AddRemoteFileDialog,
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
