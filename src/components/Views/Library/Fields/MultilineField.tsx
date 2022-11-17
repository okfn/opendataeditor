import * as React from 'react'
import TextField from '@mui/material/TextField'

// TODO: shall we open a modal editor for this field?

interface MultilineFieldProps {
  type?: string
  label: string
  value: any
  rows?: number
  size?: 'small' | 'medium'
  onChange: (value: any) => void
}

export default function MultilineField(props: MultilineFieldProps) {
  return (
    <TextField
      multiline
      fullWidth
      rows={props.rows}
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'small'}
      onChange={(ev) => props.onChange(ev.target.value as any)}
    />
  )
}
