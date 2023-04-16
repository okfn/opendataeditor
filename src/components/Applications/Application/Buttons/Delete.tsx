import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '../../../Parts/Buttons/Icon'
import { selectors, useStore } from '../store'
import { useConfirm } from 'material-ui-confirm'

export default function DeleteButton() {
  const confirm = useConfirm()
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'Folder' : 'File'
  return (
    <IconButton
      label="Delete"
      Icon={DeleteIcon}
      disabled={!path}
      variant="text"
      color="warning"
      onClick={() => {
        confirm({
          title: `Delete ${type}`,
          confirmationText: 'Delete',
          description: `You are deleting "${path}". Are you sure?`,
          confirmationButtonProps: {
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
