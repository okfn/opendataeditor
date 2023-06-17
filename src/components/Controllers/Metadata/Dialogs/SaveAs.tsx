import * as React from 'react'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function SaveAsDialog() {
  const path = useStore((state) => state.path)
  const saveAs = useStore((state) => state.saveAs)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <InputDialog
      open={true}
      value={path}
      title="Save As"
      label="Save"
      Icon={SaveAltIcon}
      placholder="Enter a path"
      description={`You are saving "${path}" to a new path. Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await saveAs(toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
