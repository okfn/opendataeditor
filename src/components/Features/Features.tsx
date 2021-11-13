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
import { IFeatures } from '../../interfaces/features'
import * as helpers from '../../helpers'

interface FeaturesProps {
  features?: IFeatures
  onSave?: (features: IFeatures) => void
}

interface FeaturesState {
  next: IFeatures
  prev: IFeatures
  onSave: (features: IFeatures) => void
  isPreview: boolean
  isUpdated: boolean
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: FeaturesProps) {
  const onSave = props.onSave || noop
  // TODO: move the default to a proper place
  const features = props.features || {
    layout: { header: true, headerRows: [1] },
    dialect: { code: 'csv', delimiter: ',' },
    control: { code: 'local' },
  }
  return create<FeaturesState>((set, get) => ({
    next: cloneDeep(features),
    prev: features,
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

const { Provider, useStore } = createContext<FeaturesState>()
export default function Features(props: FeaturesProps) {
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
        <Layout />
      </Grid>
      <Grid item xs={3}>
        <Dialect />
      </Grid>
      <Grid item xs={3}>
        <Control />
      </Grid>
    </Grid>
  )
}

function Preview() {
  const features = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(features, null, 2)}</code>
    </pre>
  )
}

function Layout() {
  const layout = useStore((state) => state.next.layout)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Layout</Typography>
      <TextField
        select
        margin="normal"
        label="Header"
        value={layout.header ? 'yes' : 'no'}
        onChange={(ev) =>
          update({ layout: { ...layout, header: ev.target.value === 'yes' } })
        }
        sx={{ width: '30ch' }}
      >
        <MenuItem value={'yes'}>Yes</MenuItem>
        <MenuItem value={'no'}>No</MenuItem>
      </TextField>
      <TextField
        label="Header Rows"
        margin="normal"
        value={(layout.headerRows || []).join(',')}
        onChange={(ev) =>
          update({ layout: { ...layout, headerRows: ev.target.value.split(',') } })
        }
      />
    </FormControl>
  )
}

// TODO: handle different formats
function Dialect() {
  const dialect = useStore((state) => state.next.dialect)
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">Dialect</Typography>
      <TextField label="Code" disabled margin="normal" defaultValue={dialect.code} />
      <TextField
        label="Delimiter"
        margin="normal"
        value={dialect.delimiter}
        onChange={(ev) => update({ dialect: { ...dialect, delimiter: ev.target.value } })}
      />
    </FormControl>
  )
}

function Control() {
  return (
    <FormControl>
      <Typography variant="h6">Control</Typography>
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
          download="features.json"
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
