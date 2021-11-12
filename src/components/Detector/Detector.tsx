import * as React from 'react'
import noop from 'lodash/noop'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
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

interface DetectorProps {
  detector?: IDetector
  onSave?: (detector: IDetector) => void
}

interface DetectorContext {
  prev: IDetector
  next: IDetector
  onSave: (detector: IDetector) => void
}

const Context = React.createContext({} as DetectorContext)

export default function Detector(props: DetectorProps) {
  const onSave = props.onSave || noop
  const detector = props.detector || { bufferSize: 10000, sampleSize: 100 }
  const context = { prev: detector, next: cloneDeep(detector), onSave }
  return (
    <Context.Provider value={context}>
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
  const context = React.useContext(Context)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        type="number"
        label="Buffer Size"
        inputProps={{ min: 0, step: 10000 }}
        defaultValue={context.next.bufferSize}
        onChange={(ev) => (context.next.bufferSize = parseInt(ev.target.value))}
        margin="normal"
      />
      <TextField
        type="number"
        label="Sample Size"
        inputProps={{ min: 0, step: 100 }}
        defaultValue={context.next.sampleSize}
        onChange={(ev) => (context.next.sampleSize = parseInt(ev.target.value))}
        margin="normal"
      />
    </FormControl>
  )
}

function Field() {
  const context = React.useContext(Context)
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField
        label="Type"
        margin="normal"
        defaultValue={context.next.fieldType}
        onChange={(ev) => (context.next.fieldType = ev.target.value)}
      />
      <TextField
        label="Names"
        margin="normal"
        defaultValue={(context.next.fieldNames || []).join(',')}
        onChange={(ev) => (context.next.fieldNames = ev.target.value.split(','))}
      />
    </FormControl>
  )
}

function Schema() {
  const context = React.useContext(Context)
  return (
    <FormControl>
      <Typography variant="h6">Schema</Typography>
      <TextField
        select
        label="Sync"
        defaultValue={context.next.schemaSync ? 'yes' : 'no'}
        onChange={(ev) => (context.next.schemaSync = ev.target.value === 'yes')}
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
  const context = React.useContext(Context)
  const isUpdated = !isEqual(context.next, context.prev)
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Stack spacing={2} direction="row" sx={{ pl: 0 }}>
        <Button
          variant="contained"
          disabled={!isUpdated}
          onClick={() => context.onSave(context.next)}
        >
          Save
        </Button>
        <Button
          variant="contained"
          disabled={!isUpdated}
          onClick={() => (context.next = cloneDeep(context.prev))}
        >
          Restore
        </Button>
        <Button
          variant="contained"
          download="detector.json"
          href={helpers.exportDescriptor(context.next)}
        >
          Export
        </Button>
      </Stack>
    </Box>
  )
}
