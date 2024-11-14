import TwoButtonDialog from '../../Parts/Dialogs/TwoButton'
import * as store from '@client/store'

export default function DeleteFilesFoldersDialog() {
  const path = store.useStore((state) => state.path)
  const files = store.useStore((state) => state.files)
  const selectedMultiplePaths = store.useStore((state) => state.selectedMultiplePaths)
  const isFolder = store.useStore(store.getIsFolder)

  const selectedFolders = files
    .filter((file) => {
      return selectedMultiplePaths?.includes(file.path) && file.type === 'folder'
    })
    .map((file) => file.path)

  const selectedFiles = files
    .filter((file) => {
      return selectedMultiplePaths?.includes(file.path) && file.type !== 'folder'
    })
    .map((file) => file.path)

  if (!path) return null

  return (
    <TwoButtonDialog
      open={true}
      title="Delete File"
      description={
        selectedMultiplePaths
          ? 'Are you sure you want to delete these elements?'
          : `Are you sure you want to delete this ${isFolder ? 'folder' : 'file'}?`
      }
      label="Delete"
      hoverBgButtonColor="OKFNRed600"
      cancelLabel="No"
      onCancel={store.closeDialog}
      onConfirm={async () => {
        if (selectedMultiplePaths) {
          if (selectedFolders.length > 0) await store.deleteFolders(selectedFolders)
          if (selectedFiles.length > 0) await store.deleteFiles(selectedFiles)
        }
        // is only one selected file
        else {
          if (isFolder) await store.deleteFolders([path])
          else await store.deleteFiles([path])
        }
        store.closeDialog()
      }}
    />
  )
}
