import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'

export default function Detector() {
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField label="Buffer" margin="normal" defaultValue={10000} />
      <TextField label="Sample" margin="normal" defaultValue={100} />
    </FormControl>
  )
}
