import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

export default function Detector() {
  return (
    <Grid container>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={3}>
        <Field />
      </Grid>
      <Grid item xs={3}>
        <Schema />
      </Grid>
    </Grid>
  )
}

function General() {
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField label="Buffer" margin="normal" defaultValue={10000} />
      <TextField label="Sample" margin="normal" defaultValue={100} />
    </FormControl>
  )
}

function Schema() {
  return (
    <FormControl>
      <Typography variant="h6">Schema</Typography>
      <TextField
        select
        margin="normal"
        label="Sync"
        defaultValue={'false'}
        sx={{ width: '200px' }}
      >
        <MenuItem value={'true'}>Yes</MenuItem>
        <MenuItem value={'false'}>No</MenuItem>
      </TextField>
    </FormControl>
  )
}

function Field() {
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField label="Type" margin="normal" defaultValue={''} />
      <TextField label="Names" margin="normal" defaultValue={''} />
    </FormControl>
  )
}
