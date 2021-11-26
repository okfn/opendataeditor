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
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import ButtonGroup from '@mui/material/ButtonGroup'
import { IResource } from '../../interfaces'
import * as settings from '../../settings'

export interface ResourceProps {
  descriptor: IResource
  onCommit?: (descriptor: IResource) => void
  onRevert?: (descriptor: IResource) => void
}

interface ResourceState {
  descriptor: IResource
  checkpoint: IResource
  onCommit: (descriptor: IResource) => void
  onRevert: (descriptor: IResource) => void
  // TODO: handle all the state in previewFormat?
  isPreview?: boolean
  // TODO: use deep equality check instead of the flag
  isUpdated?: boolean
  exportFormat: string
  exporter: () => void
  importer: (file: File) => void
  preview: (format: string) => void
  update: (patch: object) => void
  commit: () => void
  revert: () => void
}

function makeStore(props: ResourceProps) {
  return create<ResourceState>((set, get) => ({
    descriptor: cloneDeep(props.descriptor),
    checkpoint: cloneDeep(props.descriptor),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    exporter: () => {
      const { descriptor, exportFormat } = get()
      const isYaml = exportFormat === 'yaml'
      const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
      const blob = new Blob([text], { type: `text/${exportFormat};charset=utf-8` })
      FileSaver.saveAs(blob, `${descriptor.name}.resource.${exportFormat}`)
      set({ exportFormat: settings.DEFAULT_EXPORT_FORMAT, isPreview: false })
    },
    importer: async (file) => {
      const text = (await file.text()).trim()
      const isYaml = !text.startsWith('{')
      // TODO: handle errors and validate descriptor
      const descriptor = isYaml ? yaml.load(text) : JSON.parse(text)
      set({ descriptor, isUpdated: true })
    },
    preview: (format) => {
      let { exportFormat, isPreview } = get()
      isPreview = !isPreview || exportFormat !== format
      exportFormat = isPreview ? format : settings.DEFAULT_EXPORT_FORMAT
      set({ exportFormat, isPreview })
    },
    update: (patch) => {
      const { descriptor } = get()
      set({ descriptor: { ...descriptor, ...patch }, isUpdated: true })
    },
    revert: () => {
      const { onRevert, descriptor, checkpoint } = get()
      set({ descriptor: cloneDeep(checkpoint), isUpdated: false })
      onRevert(descriptor)
    },
    commit: () => {
      const { onCommit, descriptor } = get()
      set({ checkpoint: cloneDeep(descriptor), isUpdated: false })
      onCommit(descriptor)
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
        <General />
      </Grid>
      <Grid item xs={3}>
        <Details />
      </Grid>
      <Grid item xs={3}>
        <Stats />
      </Grid>
      <Grid item xs={3}>
        <Help />
      </Grid>
    </Grid>
  )
}

function Preview() {
  const descriptor = useStore((state) => state.descriptor)
  const exportFormat = useStore((state) => state.exportFormat)
  const isYaml = exportFormat === 'yaml'
  const text = isYaml ? yaml.dump(descriptor) : JSON.stringify(descriptor, null, 2)
  return (
    <Box sx={{ height: '352px', overflowY: 'auto' }}>
      <pre style={{ marginTop: 0 }}>
        <code>{text}</code>
      </pre>
    </Box>
  )
}

function General() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)
  return (
    <FormControl fullWidth>
      <Typography variant="h6">General</Typography>
      <TextField label="Path" margin="normal" defaultValue={descriptor.path} disabled />
      <TextField
        label="Name"
        margin="normal"
        value={descriptor.name}
        onChange={(ev) => update({ name: ev.target.value })}
      />
      <TextField
        label="Title"
        margin="normal"
        value={descriptor.title || ''}
        onChange={(ev) => update({ title: ev.target.value })}
      />
      <TextField
        label="Description"
        margin="normal"
        multiline
        value={descriptor.description || ''}
        onChange={(ev) => update({ description: ev.target.value })}
      />
    </FormControl>
  )
}

function Details() {
  const descriptor = useStore((state) => state.descriptor)
  const update = useStore((state) => state.update)
  return (
    <FormControl fullWidth>
      <Typography variant="h6">Details</Typography>
      <TextField label="Scheme" margin="normal" disabled value={descriptor.scheme} />
      <TextField
        select
        label="Format"
        value={descriptor.format}
        onChange={(ev) => update({ format: ev.target.value })}
        margin="normal"
        fullWidth
      >
        {settings.FORMATS.map((format) => (
          <MenuItem key={format} value={format}>
            {format}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Hashing"
        value={descriptor.hashing}
        onChange={(ev) => update({ hashing: ev.target.value })}
        margin="normal"
        fullWidth
      >
        {settings.HASHINGS.map((hashing) => (
          <MenuItem key={hashing} value={hashing}>
            {hashing}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Encoding"
        value={descriptor.encoding}
        onChange={(ev) => update({ encoding: ev.target.value })}
        margin="normal"
        fullWidth
      >
        {settings.ENCODINGS.map((encoding) => (
          <MenuItem key={encoding} value={encoding}>
            {encoding}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  )
}

function Stats() {
  const descriptor = useStore((state) => state.descriptor)
  const keys = ['hash', 'bytes', 'fields', 'rows']
  return (
    <FormControl fullWidth>
      <Typography variant="h6">Stats</Typography>
      {keys.map((key) => (
        <TextField
          key={key}
          disabled
          margin="normal"
          label={capitalize(key)}
          /* @ts-ignore */
          value={descriptor.stats[key]}
        />
      ))}
    </FormControl>
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
          overview
        </Typography>
        <Typography variant="body2">
          The Data Resource format describes a data resource such as an individual file or
          data table. The essence of a Data Resource is a path to the data file it
          describes. A range of other properties can be declared to provide a richer set
          of metadata including Table Schema for tabular data and File Dialect.
        </Typography>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Button
          size="small"
          component="a"
          target="_blank"
          href="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-resource"
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

function Actions() {
  const isPreview = useStore((state) => state.isPreview)
  const isUpdated = useStore((state) => state.isUpdated)
  const exportFormat = useStore((state) => state.exportFormat)
  const exporter = useStore((state) => state.exporter)
  const importer = useStore((state) => state.importer)
  const preview = useStore((state) => state.preview)
  const commit = useStore((state) => state.commit)
  const revert = useStore((state) => state.revert)
  const isJsonPreview = isPreview && exportFormat === 'json'
  const isYamlPreview = isPreview && exportFormat === 'yaml'
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
              title={`Export descriptor as ${exportFormat.toUpperCase()}`}
              onClick={exporter}
              sx={{ width: '60%' }}
            >
              Export
            </Button>
            <Button
              title="Toggle JSON preview"
              onClick={() => preview('json')}
              color={isJsonPreview ? 'warning' : 'info'}
            >
              JSON
            </Button>
            <Button
              title="Toggle YAML preview"
              onClick={() => preview('yaml')}
              color={isYamlPreview ? 'warning' : 'info'}
            >
              YAML
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={3}>
          <label htmlFor="import-button">
            <input
              type="file"
              id="import-button"
              accept=".json, .yaml"
              style={{ display: 'none' }}
              onChange={(ev: React.ChangeEvent<HTMLInputElement>) => {
                if (ev.target.files) importer(ev.target.files[0])
                ev.target.value = ''
              }}
            />
            <Button
              title="Import descriptor as JSON or YAML"
              variant="contained"
              component="span"
              color="info"
              fullWidth
            >
              Import
            </Button>
          </label>
        </Grid>
        <Grid item xs={3}>
          <Button
            title="Commit changes to use them further"
            variant="contained"
            disabled={!isUpdated}
            onClick={commit}
            color="success"
            fullWidth
          >
            Commit
          </Button>
        </Grid>
        <Grid item xs={3}>
          <Button
            title="Revert changes to the initial state"
            variant="contained"
            disabled={!isUpdated}
            onClick={revert}
            color="error"
            fullWidth
          >
            Revert
          </Button>
        </Grid>
      </Grid>
    </Box>
  )
}
