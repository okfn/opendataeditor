import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import { selectors, useStore } from '../store'
import { useConfirm } from 'material-ui-confirm'

export default function DeleteButton() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  const isFolder = useStore(selectors.isFolder)
  const confirm = useConfirm()
  const type = isFolder ? 'Folder' : 'File'
  return (
    <DefaultButton
      label="Delete"
      icon={<DeleteIcon fontSize="small" sx={{ mr: 1 }} />}
      disabled={!path}
      variant="text"
      color="warning"
      onClick={() => {
        confirm({
          title: `Delete ${type}`,
          confirmationText: 'Delete',
          description: `You are deleting "${path}". Are you sure?`,
          confirmationButtonProps: {
            color: 'secondary',
            variant: 'contained',
            sx: { width: '50%' },
            autoFocus: true,
          },
          cancellationButtonProps: {
            color: 'warning',
            variant: 'contained',
            sx: { width: '50%' },
          },
        }).then(() => {
          deleteFile()
        })
      }}
    />
  )
}
