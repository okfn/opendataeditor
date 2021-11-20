import * as React from 'react'
import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import capitalize from 'lodash/capitalize'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import { IResource } from '../../interfaces/resource'
import * as helpers from '../../helpers'

export interface ResourceProps {
  resource: IResource
  onSave?: (resource: IResource) => void
}

interface ResourceState {
  next: IResource
  prev: IResource
  onSave: (resource: IResource) => void
  isPreview: boolean
  isUpdated: boolean
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: ResourceProps) {
  const resource = props.resource
  const onSave = props.onSave || noop
  return create<ResourceState>((set, get) => ({
    next: cloneDeep(resource),
    prev: resource,
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

const { Provider, useStore } = createContext<ResourceState>()
export default function Resource(props: ResourceProps) {
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
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <Help />
      </Grid>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={3}>
        <Details />
      </Grid>
      <Grid item xs={3}>
        <Stats />
      </Grid>
    </Grid>
  )
}

function Preview() {
  const resource = useStore((state) => state.next)
  return (
    <pre>
      <code>{JSON.stringify(resource, null, 2)}</code>
    </pre>
  )
}

function Help() {
  return (
    <Card variant="outlined" sx={{ height: 'calc(100% - 8px)' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Help
        </Typography>
        <Typography variant="h5" component="div">
          Resource
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          describe
        </Typography>
        <Typography variant="body2">
          Frictionless is a framework to describe, extract, validate, and transform
          tabular data in Python.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}

function General() {
  const resource = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl sx={{ width: '100%' }}>
      <Typography variant="h6">General</Typography>
      <TextField label="Path" margin="normal" defaultValue={resource.path} disabled />
      <TextField
        label="Name"
        margin="normal"
        value={resource.name}
        onChange={(ev) => update({ name: ev.target.value })}
      />
      <TextField
        label="Title"
        margin="normal"
        value={resource.title || ''}
        onChange={(ev) => update({ title: ev.target.value })}
      />
      <TextField
        label="Description"
        margin="normal"
        multiline
        value={resource.description || ''}
        onChange={(ev) => update({ description: ev.target.value })}
      />
    </FormControl>
  )
}

function Details() {
  const resource = useStore((state) => state.next)
  const update = useStore((state) => state.update)
  return (
    <FormControl sx={{ width: '100%' }}>
      <Typography variant="h6">Details</Typography>
      <TextField label="Scheme" margin="normal" disabled defaultValue={resource.scheme} />
      <TextField
        label="Format"
        margin="normal"
        value={resource.format}
        onChange={(ev) => update({ format: ev.target.value })}
      />
      <TextField
        label="Hashing"
        margin="normal"
        value={resource.hashing}
        onChange={(ev) => update({ hashing: ev.target.value })}
      />
      <TextField
        label="Encoding"
        margin="normal"
        value={resource.encoding}
        onChange={(ev) => update({ encoding: ev.target.value })}
      />
    </FormControl>
  )
}

function Stats() {
  const resource = useStore((state) => state.next)
  const keys = ['hash', 'bytes', 'fields', 'rows']
  return (
    <FormControl sx={{ width: '100%' }}>
      <Typography variant="h6">Stats</Typography>
      {keys.map((key) => (
        <TextField
          key={key}
          disabled
          margin="normal"
          label={capitalize(key)}
          /* @ts-ignore */
          defaultValue={resource.stats[key]}
        />
      ))}
    </FormControl>
  )
}

function Actions() {
  const resource = useStore((state) => state.next)
  // const isPreview = useStore((state) => state.isPreview)
  const isUpdated = useStore((state) => state.isUpdated)
  const preview = useStore((state) => state.preview)
  const revert = useStore((state) => state.revert)
  const save = useStore((state) => state.save)
  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Button
            variant="contained"
            onClick={preview}
            sx={{ width: '100%' }}
            color="info"
          >
            Import
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            download={`${resource.name}.resource.json`}
            href={helpers.exportDescriptor(resource)}
            sx={{ width: '100%' }}
            color="info"
          >
            Export
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            disabled={!isUpdated}
            onClick={save}
            color="success"
            sx={{ width: '100%' }}
          >
            Apply
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            disabled={!isUpdated}
            onClick={revert}
            color="error"
            sx={{ width: '100%' }}
          >
            Revert
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
