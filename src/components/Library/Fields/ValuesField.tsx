import * as React from 'react'
import capitalize from 'lodash/capitalize'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

// TODO: allow free values input

interface ValuesFieldProps {
  type: 'missing' | 'true' | 'false'
  values: string[]
  options: string[]
  size?: 'small' | 'medium'
  handleChange: (value: string[]) => void
}

export default function ValuesField(props: ValuesFieldProps) {
  return (
    <TextField
      select
      fullWidth
      margin="normal"
      size={props.size || 'medium'}
      label={`${capitalize(props.type)} Values`}
      value={encodeValues(props.values)}
      onChange={(ev) => props.handleChange(decodeValues((ev.target as any).value))}
      SelectProps={{ multiple: true }}
    >
      {props.options.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  )
}

function encodeValues(values: string[]) {
  return values.map((value) => (value === '' ? '""' : value))
}

function decodeValues(values: string[]) {
  return values.map((value) => (value === '""' ? '' : value))
}
