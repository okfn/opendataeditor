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
import { IStrategy } from '../../interfaces'
import * as helpers from '../../helpers'

interface StrategyProps {
  strategy: IStrategy
  onSave?: (strategy: IStrategy) => void
}

interface StrategyState {
  next: IStrategy
  prev: IStrategy
  onSave: (strategy: IStrategy) => void
  isPreview: boolean
  isUpdated: boolean
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: StrategyProps) {
  const strategy = props.strategy
  const onSave = props.onSave || noop
  return create<StrategyState>((set, get) => ({
    next: cloneDeep(strategy),
    prev: strategy,
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

const { Provider, useStore } = createContext<StrategyState>()
export default function Strategy(props: StrategyProps) {
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
  const strategy = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(strategy, null, 2)}</code>
    </pre>
  )
}

function General() {
  const strategy = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        type="number"
        label="Buffer Size"
        inputProps={{ min: 0, step: 10000 }}
        value={strategy.bufferSize}
        onChange={(ev) => update({ bufferSize: parseInt(ev.target.value) })}
        margin="normal"
      />
      <TextField
        type="number"
        label="Sample Size"
        inputProps={{ min: 0, step: 100 }}
        value={strategy.sampleSize}
        onChange={(ev) => update({ sampleSize: parseInt(ev.target.value) })}
        margin="normal"
      />
    </FormControl>
  )
}

function Field() {
  const strategy = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField
        label="Type"
        margin="normal"
        value={strategy.fieldType}
        onChange={(ev) => update({ fieldType: ev.target.value })}
      />
      <TextField
        label="Names"
        margin="normal"
        value={(strategy.fieldNames || []).join(',')}
        onChange={(ev) => update({ fieldNames: ev.target.value.split(',') })}
      />
    </FormControl>
  )
}

function Schema() {
  const strategy = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Schema</Typography>
      <TextField
        select
        label="Sync"
        value={strategy.schemaSync ? 'yes' : 'no'}
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
  const strategy = useStore((state) => state.next)
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
          download="strategy.json"
          href={helpers.exportDescriptor(strategy)}
        >
          Export
        </Button>
        <Button
          variant={isPreview ? 'outlined' : 'contained'}
          onClick={preview}
          color="warning"
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
