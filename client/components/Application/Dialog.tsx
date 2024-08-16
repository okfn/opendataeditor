import AddRemoteFileDialog from './Dialogs/AddRemoteFile'
import AddEmptyFolderDialog from './Dialogs/AddEmptyFolder'
import AdjustFileDialog from './Dialogs/AdjustFile'
import CloseDesktopAppDialog from './Dialogs/CloseDesktopApp'
import ConfigDialog from './Dialogs/Config'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import CreateDialog from './Dialogs/Create'
import DeleteFilesFoldersDialog from './Dialogs/DeleteFilesFolders'
import IndexFilesDialog from './Dialogs/IndexFiles'
import MoveFileDialog from './Dialogs/MoveFile'
import MoveFolderDialog from './Dialogs/MoveFolder'
import PublishDialog from './Dialogs/Publish'
import UnsavedChangesDialog from './Dialogs/UnsavedChanges'
import WelcomeBannerDialog from './Dialogs/WelcomeBanner'
import FileUploadDialog from './Dialogs/FileUpload'
import * as store from '@client/store'

export default function Dialog() {
  const dialog = store.useStore((state) => state.dialog)
  if (!dialog) return null

  // @ts-ignore
  const Dialog = DIALOGS[dialog]
  if (!Dialog) return null

  return <Dialog />
}

const DIALOGS = {
  addEmptyFolder: AddEmptyFolderDialog,
  addRemoteFile: AddRemoteFileDialog,
  adjustFile: AdjustFileDialog,
  closeDesktopApp: CloseDesktopAppDialog,
  config: ConfigDialog,
  configProject: ConfigDialog,
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  create: CreateDialog,
  deleteFilesFolders: DeleteFilesFoldersDialog,
  indexFiles: IndexFilesDialog,
  moveFile: MoveFileDialog,
  moveFolder: MoveFolderDialog,
  publish: PublishDialog,
  unsavedChanges: UnsavedChangesDialog,
  welcomeBanner: WelcomeBannerDialog,
  fileUpload: FileUploadDialog,
} as const
