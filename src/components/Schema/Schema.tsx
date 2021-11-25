import * as React from 'react'
import create from 'zustand'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
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
import { ISchema } from '../../interfaces'
import * as settings from '../../settings'

export interface SchemaProps {
  descriptor: ISchema
  onCommit?: (descriptor: ISchema) => void
  onRevert?: (descriptor: ISchema) => void
}

interface SchemaState {
  descriptor: ISchema
  checkpoint: ISchema
  onCommit: (descriptor: ISchema) => void
  onRevert: (descriptor: ISchema) => void
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

function makeStore(props: SchemaProps) {
  return create<SchemaState>((set, get) => ({
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
      FileSaver.saveAs(blob, `schema.${exportFormat}`)
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

const { Provider, useStore } = createContext<SchemaState>()
export default function Schema(props: SchemaProps) {
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
      <Grid item xs={6}>
        <Fields />
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
      <TextField
        label="Missing Values"
        margin="normal"
        value={descriptor.missingValues.join(',')}
        onChange={(ev) => update({ missingValues: ev.target.value.split(',') })}
      />
      <TextField
        label="Primary Key"
        margin="normal"
        value={(descriptor.primaryKey || []).join(',')}
        onChange={(ev) => update({ primaryKey: ev.target.value.split(',') })}
      />
      <TextField
        label="Foreign Keys"
        margin="normal"
        value=""
        onChange={() => {}}
        multiline
      />
      <TextField label="Fields" margin="normal" value="" onChange={() => {}} multiline />
    </FormControl>
  )
}

function Fields() {
  return (
    <FormControl fullWidth>
      <Typography variant="h6">Fields</Typography>
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
          Schema
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          describe
        </Typography>
        <Typography variant="body2">
          Table Schema is a specification for providing a &quote;schema&quote; (similar to
          a database schema) for tabular data. This information includes the expected data
          type for each value in a column , constraints on the value , and the expected
          format of the data.
        </Typography>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Button
          size="small"
          component="a"
          target="_blank"
          href="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-schema"
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
