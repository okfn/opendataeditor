import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import { useStore } from '../store'

export default function DeleteFileDialog() {
  const path = useStore((state) => state.path)
  const selectedMultiplePaths = useStore((state) => state.selectedMultiplePaths)
  const deleteFiles = useStore((state) => state.deleteFiles)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <ConfirmDialog
      open={true}
      title="Delete File"
      description={
        selectedMultiplePaths
          ? 'Are you sure you want to delete these files?'
          : 'Are you sure you want to delete this file?'
      }
      label="Yes"
      cancelLabel="No"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        if (selectedMultiplePaths) await deleteFiles(selectedMultiplePaths)
        else await deleteFiles([path])
        updateState({ dialog: undefined })
      }}
    />
  )
}
