import * as React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function CopyFolderDialog() {
  const path = useStore((state) => state.path)
  const copyFolder = useStore((state) => state.copyFolder)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <InputDialog
      open={true}
      value={path}
      title="Copy Folder"
      label="Copy"
      Icon={ContentCopyIcon}
      placholder="Enter a path"
      description={`You are copying "${path}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await copyFolder(path, toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
