import * as React from 'react'
import create from 'zustand'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
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
import ButtonGroup from '@mui/material/ButtonGroup'
// import MenuButton from '../Library/MenuButton'
import { IResource } from '../../interfaces'

export interface ResourceProps {
  resource: IResource
  onCommit?: (resource: IResource) => void
  onRevert?: (resource: IResource) => void
}

interface ResourceState {
  next: IResource
  prev: IResource
  onCommit: (resource: IResource) => void
  onRevert: (resource: IResource) => void
  previewFormat?: string
  isUpdated: boolean
  update: (patch: object) => void
  preview: (format: string) => void
  revert: () => void
  commit: () => void
}

function makeStore(props: ResourceProps) {
  const resource = props.resource
  const onCommit = props.onCommit || noop
  const onRevert = props.onRevert || noop
  return create<ResourceState>((set, get) => ({
    next: cloneDeep(resource),
    prev: resource,
    onCommit,
    onRevert,
    isUpdated: false,
    update: (patch) => {
      const { next } = get()
      set({ next: { ...next, ...patch }, isUpdated: true })
    },
    preview: (format) => {
      const { previewFormat } = get()
      set({ previewFormat: previewFormat !== format ? format : undefined })
    },
    commit: () => {
      const { onCommit, next } = get()
      set({ prev: cloneDeep(next), isUpdated: false })
      onCommit(next)
    },
    revert: () => {
      const { onRevert, next, prev } = get()
      set({ next: cloneDeep(prev), isUpdated: false })
      onRevert(next)
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
  const previewFormat = useStore((state) => state.previewFormat)
  if (previewFormat) return <Preview />
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
  const previewFormat = useStore((state) => state.previewFormat)
  const resource = useStore((state) => state.next)
  return (
    <Box sx={{ maxHeight: '352px', overflowY: 'auto' }}>
      <pre style={{ marginTop: 0 }}>
        <code>
          {previewFormat === 'json'
            ? JSON.stringify(resource, null, 2)
            : yaml.dump(resource)}
        </code>
      </pre>
    </Box>
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
  const previewFormat = useStore((state) => state.previewFormat)
  const isUpdated = useStore((state) => state.isUpdated)
  const preview = useStore((state) => state.preview)
  const update = useStore((state) => state.update)
  const commit = useStore((state) => state.commit)
  const revert = useStore((state) => state.revert)

  // Actions

  const exportJson = () => {
    const text = JSON.stringify(resource, null, 2)
    const blob = new Blob([text], { type: 'text/json;charset=utf-8' })
    FileSaver.saveAs(blob, `${resource.name}.resource.json`)
    // TODO: fix this hack
    preview('')
  }

  const exportYaml = () => {
    const text = yaml.dump(resource)
    const blob = new Blob([text], { type: 'text/yaml;charset=utf-8' })
    FileSaver.saveAs(blob, `${resource.name}.resource.yaml`)
    // TODO: fix this hack
    preview('')
  }

  const importFile = async (file: File) => {
    const text = (await file.text()).trim()
    // TODO: handle errors
    const resource = text.startsWith('{') ? JSON.parse(text) : yaml.load(text)
    update(resource)
    commit()
  }

  // Render

  return (
    <Box>
      <Divider sx={{ mt: 2, mb: 3 }} />
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <ButtonGroup
            variant="contained"
            color="info"
            aria-label="export"
            sx={{ width: '100%' }}
          >
            <Button
              onClick={() => (previewFormat === 'yaml' ? exportYaml() : exportJson())}
              sx={{ width: '60%' }}
            >
              Export
            </Button>
            <Button
              onClick={() => preview('json')}
              color={previewFormat === 'json' ? 'warning' : 'info'}
            >
              JSON
            </Button>
            <Button
              onClick={() => preview('yaml')}
              color={previewFormat === 'yaml' ? 'warning' : 'info'}
            >
              YAML
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={3}>
          <label htmlFor="import-button">
            <input
              id="import-button"
              type="file"
              style={{ display: 'none' }}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) =>
                ev.target.files ? importFile(ev.target.files[0]) : null
              }
            />
            <Button variant="contained" component="span" color="info" fullWidth>
              Import
            </Button>
          </label>
        </Grid>
        <Grid item xs={3}>
          <Button
            variant="contained"
            disabled={!isUpdated}
            onClick={commit}
            color="success"
            sx={{ width: '100%' }}
          >
            Commit
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
