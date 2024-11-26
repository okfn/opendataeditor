import * as store from '@client/store'
import AddEmptyFolderDialog from './Dialogs/AddEmptyFolder'
import CloseWithUnsavedChangesDialog from './Dialogs/CloseWithUnsavedChanges'
import ConfigDialog from './Dialogs/Config'
import CopyFileDialog from './Dialogs/CopyFile'
import CopyFolderDialog from './Dialogs/CopyFolder'
import { DeleteFileDialog } from './Dialogs/DeleteFile'
import { FileUploadDialog } from './Dialogs/FileUpload'
import OpenLocationDialog from './Dialogs/OpenLocation'
import PublishDialog from './Dialogs/Publish'
import RenameFileDialog from './Dialogs/RenameFile'
import { SaveChangesDialog } from './Dialogs/SaveChanges'
import UnsavedChangesDialog from './Dialogs/UnsavedChanges'
import WelcomeBannerDialog from './Dialogs/WelcomeBanner'

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
  closeWithUnsavedChanges: CloseWithUnsavedChangesDialog,
  config: ConfigDialog,
  configProject: ConfigDialog,
  copyFile: CopyFileDialog,
  copyFolder: CopyFolderDialog,
  deleteFilesFolders: DeleteFileDialog,
  publish: PublishDialog,
  unsavedChanges: UnsavedChangesDialog,
  welcomeBanner: WelcomeBannerDialog,
  fileUpload: FileUploadDialog,
  openLocation: OpenLocationDialog,
  renameFile: RenameFileDialog,
  saveChanges: SaveChangesDialog,
} as const
