import * as React from 'react'
import CopyAllIcon from '@mui/icons-material/CopyAll'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function MoveFolderDialog() {
  const path = useStore((state) => state.path)
  const moveFolder = useStore((state) => state.moveFolder)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <InputDialog
      open={true}
      value={path}
      title="Move Folder"
      label="Move"
      Icon={CopyAllIcon}
      placholder="Enter a path"
      description={`You are moving "${path}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await moveFolder(path, toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
