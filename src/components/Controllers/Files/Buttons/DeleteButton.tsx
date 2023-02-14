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
  const type = (isFolder ? 'folder' : 'file')
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
          description: `Are you sure? Your are deleting ${type} ${path}.`,
          confirmationButtonProps: {
            color: 'secondary',
            variant: 'contained',
            sx: { width: '50%' },
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
