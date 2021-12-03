import * as React from 'react'
import noop from 'lodash/noop'
import TextField from '@mui/material/TextField'

// TODO: fix it loosing focus
// TODO: handle different value types properly (string/number/etc)

interface InputFieldProps {
  type?: string
  label: string
  value: any
  size?: 'small' | 'medium'
  disabled?: boolean
  handleChange?: (value: any) => void
}

export default function InputField(props: InputFieldProps) {
  const handleChange = props.handleChange || noop
  return (
    <TextField
      fullWidth
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'medium'}
      disabled={props.disabled}
      onChange={(ev) => handleChange(ev.target.value as any)}
    />
  )
}
