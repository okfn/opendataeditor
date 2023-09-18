import * as React from 'react'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import { noop } from 'lodash'

// TODO: rework? merge with SelectField?
// TODO: handle different value types properly (string/number/etc)

interface SelectFieldProps {
  type?: string
  label?: string
  value: any
  size?: 'small' | 'medium'
  margin?: 'dense' | 'none' | 'normal'
  options: string[] | { label: string; value: any }[]
  onChange?: (value: any) => void
  InputProps?: object
  // TODO: fix
  color?: any
  focused?: boolean
  disabled?: boolean
  onFocus?: () => void
}

export default function SelectField(props: SelectFieldProps) {
  const onFocus = props.onFocus || noop
  const options = props.options.map((option) =>
    typeof option === 'string' ? { label: option || 'select', value: option } : option
  )
  return (
    <TextField
      select
      fullWidth
      label={props.label}
      margin={props.margin || 'normal'}
      value={props.value}
      size={props.size || 'small'}
      InputProps={props.InputProps}
      disabled={props.disabled}
      onChange={(ev) => props.onChange && props.onChange((ev.target as any).value)}
      color={props.color}
      focused={props.focused}
      onFocus={onFocus}
    >
      {options.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </TextField>
  )
}
