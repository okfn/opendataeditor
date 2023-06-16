import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '../../../Parts/Dialogs/Confirm'
import { useStore } from '../store'

export default function DeleteFolderDialog() {
  const path = useStore((state) => state.path)
  const deleteFolder = useStore((state) => state.deleteFolder)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <ConfirmDialog
      open={true}
      title="Delete Folder"
      label="Delete"
      Icon={DeleteIcon}
      description={`You are deleting "${path}". Are you sure?`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        await deleteFolder(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
