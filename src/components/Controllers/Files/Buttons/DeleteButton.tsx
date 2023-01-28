import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import { useStore } from '../store'

export default function DeleteButton() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  return (
    <DefaultButton
      label="Delete"
      icon={<DeleteIcon fontSize="small" sx={{ mr: 1 }} />}
      disabled={!path}
      variant="text"
      color="warning"
      onClick={() => deleteFile()}
    />
  )
}
