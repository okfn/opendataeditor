import * as React from 'react'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import InputDialog from './Input'

export interface SaveAsDialogProps {
  path?: string
  onSave: (toPath: string) => Promise<void>
  onClose: () => void
}

export default function SaveAsDialog(props: SaveAsDialogProps) {
  if (!props.path) return null
  return (
    <InputDialog
      open={true}
      value={props.path}
      title="Save As"
      label="Save"
      Icon={SaveAltIcon}
      placholder="Enter a path"
      description={`You are saving "${props.path}" to a new path. Enter destination:`}
      onCancel={props.onClose}
      onConfirm={async (toPath) => {
        await props.onSave(toPath)
        props.onClose()
      }}
    />
  )
}
