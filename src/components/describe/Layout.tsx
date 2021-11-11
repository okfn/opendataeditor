import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'

export default function Layout() {
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        select
        margin="normal"
        label="Header"
        defaultValue={'yes'}
        sx={{ width: '200px' }}
      >
        <MenuItem value={'yes'}>Yes</MenuItem>
        <MenuItem value={'no'}>No</MenuItem>
      </TextField>
    </FormControl>
  )
}
