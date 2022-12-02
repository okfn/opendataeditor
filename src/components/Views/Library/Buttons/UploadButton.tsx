import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../../settings'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface UploadButtonProps {
  label: string
  color?: 'info' | 'warning' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  fullWidth?: boolean
  displayIcon?: boolean
  // TODO: support multiple files
  onUpload: (file: File) => void
}

export default function UploadButton(props: UploadButtonProps) {
  return (
    <Button
      fullWidth={props.fullWidth}
      disabled={props.disabled}
      variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
      color={props.color || 'info'}
      component="label"
    >
      {props.displayIcon && <CloudUploadIcon />}
      Upload
      <input
        hidden
        type="file"
        onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
          ev.target.files ? props.onUpload(ev.target.files[0]) : null
        }
      />
    </Button>
  )
}
