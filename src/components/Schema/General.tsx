import * as React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Heading from '../Library/Heading'
import ValuesField from '../Library/ValuesField'
import * as settings from '../../settings'
import { useStore } from './store'

export default function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)
  return (
    <Box>
      <Heading variant="h6">General</Heading>
      <ValuesField
        type="missing"
        values={descriptor.missingValues}
        options={settings.MISSING_VALUES}
        handleChange={(missingValues) => update({ missingValues })}
      />
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
