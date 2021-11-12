import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'

const detector = {
  bufferSize: 10000,
  sampleSize: 100,
  fieldType: null,
  fieldNames: null,
}

const Context = React.createContext(detector)

export default function Detector() {
  return (
    <Context.Provider value={detector}>
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
    </Context.Provider>
  )
}

function General() {
  const detector = React.useContext(Context)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        type="number"
        label="Buffer Size"
        inputProps={{ min: 0, step: 10000 }}
        defaultValue={detector.bufferSize}
        onChange={(ev) => (detector.bufferSize = parseInt(ev.target.value))}
        margin="normal"
      />
      <TextField
        type="number"
        label="Sample Size"
        inputProps={{ min: 0, step: 100 }}
        defaultValue={detector.sampleSize}
        onChange={(ev) => (detector.sampleSize = parseInt(ev.target.value))}
        margin="normal"
      />
    </FormControl>
  )
}

function Field() {
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField label="Type" margin="normal" defaultValue={detector.fieldType} />
      <TextField label="Names" margin="normal" defaultValue={''} />
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
