import * as React from 'react'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function CopyFileDialog() {
  const path = useStore((state) => state.path)
  const copyFile = useStore((state) => state.copyFile)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <InputDialog
      open={true}
      value={path}
      title="Copy File"
      label="Copy"
      Icon={ContentCopyIcon}
      placholder="Enter a path"
      description={`You are copying "${path}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await copyFile(path, toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
