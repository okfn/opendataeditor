import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { IDetector } from '../../interfaces/detector'
import * as helpers from '../../helpers'

const detector: IDetector = {
  bufferSize: 10000,
  sampleSize: 100,
}

const Context = React.createContext({} as IDetector)

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
      <Actions />
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
  const detector = React.useContext(Context)
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField
        label="Type"
        margin="normal"
        defaultValue={detector.fieldType}
        onChange={(ev) => (detector.fieldType = ev.target.value)}
      />
      <TextField
        label="Names"
        margin="normal"
        defaultValue={(detector.fieldNames || []).join(',')}
        onChange={(ev) => (detector.fieldNames = ev.target.value.split(','))}
      />
    </FormControl>
  )
}

function Schema() {
  const detector = React.useContext(Context)
  return (
    <FormControl>
      <Typography variant="h6">Schema</Typography>
      <TextField
        select
        label="Sync"
        defaultValue={'no'}
        onChange={(ev) => (detector.schemaSync = ev.target.value === 'yes')}
        sx={{ width: '30ch' }}
        margin="normal"
      >
        <MenuItem value={'yes'}>Yes</MenuItem>
        <MenuItem value={'no'}>No</MenuItem>
      </TextField>
    </FormControl>
  )
}

function Actions() {
  const detector = React.useContext(Context)
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Stack spacing={2} direction="row" sx={{ pl: 0 }}>
        <Button variant="contained">Save</Button>
        <Button variant="contained">Restore</Button>
        <Button
          variant="contained"
          download="detector.json"
          href={helpers.exportDescriptor(detector)}
        >
          Export
        </Button>
      </Stack>
    </Box>
  )
}
