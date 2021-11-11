import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'

export default function Dialect() {
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField label="Delimiter" margin="normal" defaultValue={','} />
    </FormControl>
  )
}
