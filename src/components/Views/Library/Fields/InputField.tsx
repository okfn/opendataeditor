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
  inputProps?: object
  onChange?: (value: any) => void
  onKeyDown?: (event: any) => void
  placeholder?: string
}

export default function InputField(props: InputFieldProps) {
  const onChange = props.onChange || noop
  const onKeyDown = props.onKeyDown || noop
  return (
    <TextField
      fullWidth
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'small'}
      disabled={props.disabled}
      inputProps={props.inputProps}
      onChange={(ev) => onChange(ev.target.value as any)}
      onKeyDown={onKeyDown}
      placeholder={props.placeholder}
    />
  )
}
