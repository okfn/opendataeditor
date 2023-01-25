import * as React from 'react'
import Button from '@mui/material/Button'
import * as settings from '../../../settings'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'

interface UploadButtonProps {
  label: string
  color?: 'info' | 'warning' | 'secondary'
  disabled?: boolean
  fullWidth?: boolean
  marginR?: number
  variant?: 'contained' | 'outlined' | 'text'
  // TODO: support multiple files
  onUpload: (file: File) => void
}

export default function UploadButton(props: UploadButtonProps) {
  return (
    <React.Fragment>
      <Button
        fullWidth={props.fullWidth}
        disabled={props.disabled}
        variant={props.variant || settings.DEFUALT_BUTTON_VARIANT}
        color={props.color || 'info'}
        component="label"
      >
        <CloudUploadIcon sx={{ mr: props.marginR }} fontSize="small" />
        Upload
        <input
          hidden
          type="file"
          onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
            ev.target.files ? props.onUpload(ev.target.files[0]) : null
          }
        />
      </Button>
    </React.Fragment>
  )
}
