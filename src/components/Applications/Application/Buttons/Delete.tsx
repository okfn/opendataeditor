import * as React from 'react'
import Box from '@mui/material/Box'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '../../../Parts/Buttons/Icon'
import LightTooltip from '../../../Parts/Tooltips/Light'
import { selectors, useStore } from '../store'
import { useConfirm } from 'material-ui-confirm'

export default function DeleteButton() {
  const confirm = useConfirm()
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  const deleteFolder = useStore((state) => state.deleteFolder)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'Folder' : 'File'
  let title = 'Delete selected'
  if (!path) title = 'Select something to delete'
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label="Delete"
          Icon={DeleteIcon}
          disabled={!path}
          variant="text"
          color="warning"
          onClick={() => {
            if (!path) return
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
              isFolder ? deleteFolder(path) : deleteFile(path)
            })
          }}
        />
      </Box>
    </LightTooltip>
  )
}
