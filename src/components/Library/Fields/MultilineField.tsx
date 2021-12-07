import * as React from 'react'
import TextField from '@mui/material/TextField'

// TODO: shall we open a modal editor for this field?

interface MultilineFieldProps {
  type?: string
  label: string
  value: any
  size?: 'small' | 'medium'
  onChange: (value: any) => void
}

export default function MultilineField(props: MultilineFieldProps) {
  return (
    <TextField
      multiline
      fullWidth
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'medium'}
      onChange={(ev) => props.onChange(ev.target.value as any)}
    />
  )
}
