import * as React from 'react'
import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
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

interface DetectorState {
  next: IDetector
  prev: IDetector
  onSave: (detector: IDetector) => void
  isPreview: boolean
  isUpdated: boolean
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: DetectorProps) {
  const onSave = props.onSave || noop
  // TODO: move the default to a proper place
  const detector = props.detector || { bufferSize: 10000, sampleSize: 100 }
  return create<DetectorState>((set, get) => ({
    next: cloneDeep(detector),
    prev: detector,
    onSave,
    isPreview: false,
    isUpdated: false,
    update: (patch) => {
      const { next } = get()
      set({ next: { ...next, ...patch }, isUpdated: true })
    },
    preview: () => {
      const { isPreview } = get()
      set({ isPreview: !isPreview })
    },
    revert: () => {
      const { prev } = get()
      set({ next: cloneDeep(prev), isUpdated: false })
    },
    save: () => {
      const { onSave, next } = get()
      set({ prev: cloneDeep(next), isUpdated: false })
      onSave(next)
    },
  }))
}

const { Provider, useStore } = createContext<DetectorState>()
export default function Detector(props: DetectorProps) {
  return (
    <Provider createStore={() => makeStore(props)}>
      <Editor />
      <Actions />
    </Provider>
  )
}

function Editor() {
  const isPreview = useStore((state) => state.isPreview)
  if (isPreview) return <Preview />
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

function Preview() {
  const detector = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(detector, null, 2)}</code>
    </pre>
  )
}

function General() {
  const detector = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        type="number"
        label="Buffer Size"
        inputProps={{ min: 0, step: 10000 }}
        value={detector.bufferSize}
        onChange={(ev) => update({ bufferSize: parseInt(ev.target.value) })}
        margin="normal"
      />
      <TextField
        type="number"
        label="Sample Size"
        inputProps={{ min: 0, step: 100 }}
        value={detector.sampleSize}
        onChange={(ev) => update({ sampleSize: parseInt(ev.target.value) })}
        margin="normal"
      />
    </FormControl>
  )
}

function Field() {
  const detector = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField
        label="Type"
        margin="normal"
        value={detector.fieldType}
        onChange={(ev) => update({ fieldType: ev.target.value })}
      />
      <TextField
        label="Names"
        margin="normal"
        value={(detector.fieldNames || []).join(',')}
        onChange={(ev) => update({ fieldNames: ev.target.value.split(',') })}
      />
    </FormControl>
  )
}

function Schema() {
  const detector = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Schema</Typography>
      <TextField
        select
        label="Sync"
        value={detector.schemaSync ? 'yes' : 'no'}
        onChange={(ev) => update({ schemaSync: ev.target.value === 'yes' })}
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
  const detector = useStore((state) => state.next)
  const isPreview = useStore((state) => state.isPreview)
  const isUpdated = useStore((state) => state.isUpdated)
  const preview = useStore((state) => state.preview)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Stack spacing={2} direction="row" sx={{ pl: 0 }}>
        <Button
          variant="contained"
          download="detector.json"
          href={helpers.exportDescriptor(detector)}
        >
          Export
        </Button>
        <Button
          variant={isPreview ? 'outlined' : 'contained'}
          onClick={preview}
          color="info"
        >
          Preview
        </Button>
        <Button variant="contained" disabled={!isUpdated} onClick={revert} color="error">
          Revert
        </Button>
        <Button variant="contained" disabled={!isUpdated} onClick={save} color="success">
          Save
        </Button>
      </Stack>
    </Box>
  )
}
