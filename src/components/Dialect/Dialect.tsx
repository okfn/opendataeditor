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
import { IDialect } from '../../interfaces'
import * as helpers from '../../helpers'

interface DialectProps {
  dialect: IDialect
  onSave?: (dialect: IDialect) => void
}

interface DialectState {
  next: IDialect
  prev: IDialect
  onSave: (dialect: IDialect) => void
  isPreview: boolean
  isUpdated: boolean
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: DialectProps) {
  const dialect = props.dialect
  const onSave = props.onSave || noop
  return create<DialectState>((set, get) => ({
    next: cloneDeep(dialect),
    prev: dialect,
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

const { Provider, useStore } = createContext<DialectState>()
export default function Dialect(props: DialectProps) {
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
        <Reading />
      </Grid>
      <Grid item xs={3}>
        <Parsing />
      </Grid>
      <Grid item xs={3}>
        <Loading />
      </Grid>
    </Grid>
  )
}

function Preview() {
  const dialect = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(dialect, null, 2)}</code>
    </pre>
  )
}

function Reading() {
  const dialect = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Reading</Typography>
      <TextField
        select
        margin="normal"
        label="Header"
        value={dialect.header ? 'yes' : 'no'}
        onChange={(ev) =>
          update({ dialect: { ...dialect, header: ev.target.value === 'yes' } })
        }
        sx={{ width: '30ch' }}
      >
        <MenuItem value={'yes'}>Yes</MenuItem>
        <MenuItem value={'no'}>No</MenuItem>
      </TextField>
      <TextField
        label="Header Rows"
        margin="normal"
        value={(dialect.headerRows || []).join(',')}
        onChange={(ev) =>
          update({ dialect: { ...dialect, headerRows: ev.target.value.split(',') } })
        }
      />
    </FormControl>
  )
}

// TODO: handle different formats
function Parsing() {
  const dialect = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Parsing</Typography>
      <TextField
        label="Delimiter"
        margin="normal"
        value={dialect.delimiter}
        onChange={(ev) => update({ dialect: { ...dialect, delimiter: ev.target.value } })}
      />
    </FormControl>
  )
}

function Loading() {
  return (
    <FormControl>
      <Typography variant="h6">Loading</Typography>
      <TextField label="Code" disabled margin="normal" defaultValue={'local'} />
    </FormControl>
  )
}

function Actions() {
  const dialect = useStore((state) => state.next)
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
          download="dialect.json"
          href={helpers.exportDescriptor(dialect)}
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
