import * as React from 'react'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)
  // TODO: allow free input instead of predefined list
  const MISSING_VALUES = ['""', 'n/a', 'na', 'N/A', 'NA']
  const encodeMissingValue = (value: string) => (value === '' ? '""' : value)
  const decodeMissingValue = (value: string) => (value === '""' ? '' : value)
  return (
    <Box>
      <Typography sx={{ pt: '6px', pb: '6px' }} variant="h6">
        General
      </Typography>
      <FormControl fullWidth>
        <TextField
          select
          label="Missing Values"
          margin="normal"
          value={descriptor.missingValues.map(encodeMissingValue) || []}
          onChange={(ev) =>
            // @ts-ignore
            update({ missingValues: ev.target.value.map(decodeMissingValue) })
          }
          SelectProps={{ multiple: true }}
        >
          {MISSING_VALUES.map((value) => (
            <MenuItem key={value} value={value}>
              {value}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Primary Key"
          margin="normal"
          value={descriptor.primaryKey || []}
          onChange={(ev) => update({ primaryKey: ev.target.value })}
          SelectProps={{ multiple: true }}
        >
          {descriptor.fields.map((field) => (
            <MenuItem key={field.name} value={field.name}>
              {field.name}
            </MenuItem>
          ))}
        </TextField>
      </FormControl>
    </Box>
  )
}
