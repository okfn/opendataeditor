import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import { useStore } from '../store'
import { useConfirm } from 'material-ui-confirm'

export default function DeleteButton() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  const confirm = useConfirm()

  return (
    <DefaultButton
      label="Delete"
      icon={<DeleteIcon fontSize="small" sx={{ mr: 1 }} />}
      disabled={!path}
      variant="text"
      color="warning"
      onClick={() => {
        confirm({
          description: `This will permanently delete ${path} and it can't be undone. Please type "${path}" to confirm.`,
          confirmationKeyword: `${path}`,
          confirmationButtonProps: { color: 'secondary', variant: 'contained' },
          cancellationButtonProps: { color: 'warning', variant: 'contained' },
        }).then(() => {
          deleteFile()
        })
      }}
    />
  )
}
