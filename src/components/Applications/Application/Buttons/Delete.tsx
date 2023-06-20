import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '../../../Parts/Buttons/Icon'
import { selectors, useStore } from '../store'

export default function DeleteButton() {
  const path = useStore((state) => state.path)
  const isFolder = useStore(selectors.isFolder)
  const updateState = useStore((state) => state.updateState)
  const type = isFolder ? 'Folder' : 'File'
  return (
    <IconButton
      label="Delete"
      Icon={DeleteIcon}
      disabled={!path}
      variant="text"
      color="warning"
      onClick={() => updateState({ dialog: `delete${type}` })}
    />
  )
}
