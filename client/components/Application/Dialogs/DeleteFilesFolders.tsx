import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import { selectors, useStore } from '../store'

export default function DeleteFilesFoldersDialog() {
  const path = useStore((state) => state.path)
  const selectedMultiplePaths = useStore((state) => state.selectedMultiplePaths)
  const files = useStore((state) => state.files)
  const isFolder = useStore(selectors.isFolder)

  // const selectedElements = files.filter((file) => {
  //   if( selectedMultiplePaths?.includes(file.path) && file.type === 'folder' ) return file
  //     else return
  // })

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

  const deleteFiles = useStore((state) => state.deleteFiles)
  const deleteFolders = useStore((state) => state.deleteFolders)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null

  return (
    <ConfirmDialog
      open={true}
      title="Delete File"
      description={
        selectedMultiplePaths
          ? 'Are you sure you want to delete these elements?'
          : `Are you sure you want to delete this ${isFolder ? 'folder' : 'file'}?`
      }
      label="Yes"
      cancelLabel="No"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        if (selectedMultiplePaths) {
          if (selectedFolders.length > 0) await deleteFolders(selectedFolders)
          if (selectedFiles.length > 0) await deleteFiles(selectedFiles)
        }
        // is only one selected file
        else isFolder ? await deleteFolders([path]) : await deleteFiles([path])
        updateState({ dialog: undefined })
      }}
    />
  )
}
