import * as React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Heading from '../Library/Heading'
import { useStore } from './store'
import * as settings from './settings'

export default function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)
  return (
    <Box>
      <Heading variant="h6">General</Heading>
      <TextField
        select
        fullWidth
        label="Missing Values"
        margin="normal"
        value={encodeMissingValues(descriptor.missingValues)}
        onChange={(ev) =>
          update({ missingValues: decodeMissingValues((ev.target as any).value) })
        }
        SelectProps={{ multiple: true }}
      >
        {settings.MISSING_VALUES.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        fullWidth
        label="Primary Key"
        margin="normal"
        value={descriptor.primaryKey || []}
        onChange={(ev) => update({ primaryKey: (ev.target as any).value })}
        SelectProps={{ multiple: true }}
      >
        {descriptor.fields.map((field) => (
          <MenuItem key={field.name} value={field.name}>
            {field.name}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

function encodeMissingValues(missingValues: string[]) {
  return missingValues.map((value) => (value === '' ? '""' : value))
}

function decodeMissingValues(missingValues: string[]) {
  return missingValues.map((value) => (value === '""' ? '' : value))
}
