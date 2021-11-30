import * as React from 'react'
import TextField from '@mui/material/TextField'

// TODO: handle different value types properly (string/number/etc)

interface MultilineFieldProps {
  type?: string
  label: string
  value: any
  handleChange: (value: any) => void
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
      onChange={(ev) => props.handleChange(ev.target.value as any)}
    />
  )
}
