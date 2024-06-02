import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import { useStore } from '../store'

export default function DeleteFileDialog() {
  const paths = useStore((state) => state.paths)
  const deleteFile = useStore((state) => state.deleteFile)
  const updateState = useStore((state) => state.updateState)
  if (!paths) return null
  return (
    <ConfirmDialog
      open={true}
      title="Delete File"
      description={'Are you sure you want to delete this file?'}
      label="Yes"
      cancelLabel="No"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        await deleteFile(paths)
        updateState({ dialog: undefined })
      }}
    />
  )
}
