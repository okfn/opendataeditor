import * as React from 'react'
import TextField from '@mui/material/TextField'

// TODO: handle different value types properly (string/number/etc)

interface InputFieldProps {
  type?: string
  label: string
  value: any
  size?: 'small' | 'medium'
  handleChange: (value: any) => void
}

export default function InputField(props: InputFieldProps) {
  return (
    <TextField
      fullWidth
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'medium'}
      onChange={(ev) => props.handleChange(ev.target.value as any)}
    />
  )
}
