import * as React from 'react'
import TextField from '@mui/material/TextField'
import { noop } from 'lodash'

// TODO: shall we open a modal editor for this field?

interface MultilineFieldProps {
  name?: string
  type?: string
  label: string
  value: any
  rows?: number
  size?: 'small' | 'medium'
  onChange: (value: any) => void
  onFocus?: (event: any) => void
}

export default function MultilineField(props: MultilineFieldProps) {
  const onFocus = props.onFocus || noop
  return (
    <TextField
      multiline
      fullWidth
      name={props.name || props.label}
      rows={props.rows}
      type={props.type}
      margin="normal"
      label={props.label}
      value={props.value}
      size={props.size || 'small'}
      onChange={(ev) => props.onChange(ev.target.value as any)}
      onFocus={onFocus}
    />
  )
}
