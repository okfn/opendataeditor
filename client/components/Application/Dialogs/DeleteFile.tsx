import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import { useStore } from '../store'

export default function DeleteFileDialog() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <ConfirmDialog
      open={true}
      title="Delete File"
      label="OK"
      Icon={DeleteIcon}
      description={'Are you sure you want to delete this file?'}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        await deleteFile(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
