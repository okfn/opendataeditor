import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'

// TODO: rework? merge with SelectField?
// TODO: handle different value types properly (string/number/etc)

interface SelectFieldProps {
  type?: string
  label: string
  value: any
  size?: 'small' | 'medium'
  options: string[] | { label: string; value: any }[]
  onChange: (value: any) => void
}

export default function SelectField(props: SelectFieldProps) {
  const options = props.options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option
  )
  return (
    <TextField
      select
      fullWidth
      label={props.label}
      margin="normal"
      value={props.value}
      size={props.size || 'medium'}
      disabled={props.options.length < 2}
      onChange={(ev) => props.onChange((ev.target as any).value)}
    >
      {options.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
