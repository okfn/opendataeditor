import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import { useStore } from '../store'

export default function DeleteFolderDialog() {
  const paths = useStore((state) => state.paths)
  const deleteFolder = useStore((state) => state.deleteFolder)
  const updateState = useStore((state) => state.updateState)
  if (!paths || paths.length > 1) return null
  return (
    <ConfirmDialog
      open={true}
      title="Delete Folder"
      description="Are you sure you want to delete this folder?"
      label="Yes"
      cancelLabel="No"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        await deleteFolder(paths[0])
        updateState({ dialog: undefined })
      }}
    />
  )
}
