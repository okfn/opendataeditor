import * as React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import * as settings from '../settings'

interface MissingValuesProps {
  value: string[]
  handleChange: (missingValues: string[]) => void
}

// TODO: allow free missing values input
export default function MissingValues(props: MissingValuesProps) {
  return (
    <TextField
      select
      fullWidth
      label="Missing Values"
      margin="normal"
      value={encodeMissingValues(props.value)}
      onChange={(ev) => props.handleChange(decodeMissingValues((ev.target as any).value))}
      SelectProps={{ multiple: true }}
    >
      {settings.MISSING_VALUES.map((value) => (
        <MenuItem key={value} value={value}>
          {value}
        </MenuItem>
      ))}
    </TextField>
  )
}

function encodeMissingValues(missingValues: string[]) {
  return missingValues.map((value) => (value === '' ? '""' : value))
}

function decodeMissingValues(missingValues: string[]) {
  return missingValues.map((value) => (value === '""' ? '' : value))
}
