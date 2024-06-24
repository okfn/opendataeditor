import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import { useStore } from '../store'

export default function DeleteFolderDialog() {
  const path = useStore((state) => state.path)
  const selectedMultiplePaths = useStore((state) => state.selectedMultiplePaths)
  const deleteFolders = useStore((state) => state.deleteFolders)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <ConfirmDialog
      open={true}
      title="Delete Folder"
      description={
        selectedMultiplePaths
          ? 'Are you sure you want to delete these elements?'
          : 'Are you sure you want to delete this folder?'
      }
      label="Yes"
      cancelLabel="No"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        if (selectedMultiplePaths) await deleteFolders(selectedMultiplePaths)
        else await deleteFolders([path])
        updateState({ dialog: undefined })
      }}
    />
  )
}
