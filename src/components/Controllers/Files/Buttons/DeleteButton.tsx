import * as React from 'react'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import { useStore } from '../store'

export default function DeleteButton() {
  const path = useStore((state) => state.path)
  const deleteFile = useStore((state) => state.deleteFile)
  return (
    <DefaultButton
      disabled={!path}
      variant="text"
      label="Delete"
      color="warning"
      onClick={() => deleteFile()}
    />
  )
}
