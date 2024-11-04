import AddEmptyFolderDialog from './Dialogs/AddEmptyFolder'
import AdjustFileDialog from './Dialogs/AdjustFile'
import CloseWithUnsavedChangesDialog from './Dialogs/CloseWithUnsavedChanges'
import ConfigDialog from './Dialogs/Config'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import CreateDialog from './Dialogs/Create'
import DeleteFilesFoldersDialog from './Dialogs/DeleteFilesFolders'
import IndexFilesDialog from './Dialogs/IndexFiles'
import PublishDialog from './Dialogs/Publish'
import UnsavedChangesDialog from './Dialogs/UnsavedChanges'
import WelcomeBannerDialog from './Dialogs/WelcomeBanner'
import FileUploadDialog from './Dialogs/FileUpload'
import OpenLocationDialog from './Dialogs/OpenLocation'
import RenameFileDialog from './Dialogs/RenameFile'
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
  adjustFile: AdjustFileDialog,
  closeWithUnsavedChanges: CloseWithUnsavedChangesDialog,
  config: ConfigDialog,
  configProject: ConfigDialog,
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  create: CreateDialog,
  deleteFilesFolders: DeleteFilesFoldersDialog,
  indexFiles: IndexFilesDialog,
  publish: PublishDialog,
  unsavedChanges: UnsavedChangesDialog,
  welcomeBanner: WelcomeBannerDialog,
  fileUpload: FileUploadDialog,
  openLocation: OpenLocationDialog,
  renameFile: RenameFileDialog,
} as const
