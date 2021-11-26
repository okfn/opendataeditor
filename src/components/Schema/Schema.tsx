import * as React from 'react'
import create from 'zustand'
import noop from 'lodash/noop'
import yaml from 'js-yaml'
import FileSaver from 'file-saver'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
// import SettingsIcon from '@mui/icons-material/Settings'
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
import { ISchema } from '../../interfaces'
import * as settings from '../../settings'

export interface SchemaProps {
  descriptor: ISchema
  onCommit?: (descriptor: ISchema) => void
  onRevert?: (descriptor: ISchema) => void
}

interface SchemaState {
  page: string
  descriptor: ISchema
  checkpoint: ISchema
  onCommit: (descriptor: ISchema) => void
  onRevert: (descriptor: ISchema) => void
  // TODO: handle all the state in previewFormat?
  isPreview?: boolean
  // TODO: use deep equality check instead of the flag
  isUpdated?: boolean
  exportFormat: string
  searchQuery?: string
  setPage: (page: string) => void
  setSearchQuery: (searchQuery: string) => void
  exporter: () => void
  importer: (file: File) => void
  preview: (format: string) => void
  update: (patch: object) => void
  commit: () => void
  revert: () => void
}

function makeStore(props: SchemaProps) {
  return create<SchemaState>((set, get) => ({
    page: 'fields',
    descriptor: cloneDeep(props.descriptor),
    checkpoint: cloneDeep(props.descriptor),
    onCommit: props.onCommit || noop,
    onRevert: props.onRevert || noop,
    exportFormat: settings.DEFAULT_EXPORT_FORMAT,
    setPage: (page) => set({ page }),
    setSearchQuery: (searchQuery) => set({ searchQuery }),
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
  const page = useStore((state) => state.page)
  const isPreview = useStore((state) => state.isPreview)
  if (isPreview) return <Preview />
  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={6}>
        {page === 'fields' ? <Fields /> : <ForeignKeys />}
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
  const page = useStore((state) => state.page)
  const descriptor = useStore((state) => state.descriptor)
  const setPage = useStore((state) => state.setPage)
  const update = useStore((state) => state.update)
  // TODO: allow free input instead of predefined list
  const MISSING_VALUES = ['""', 'n/a', 'na', 'N/A', 'NA']
  const encodeMissingValue = (value: string) => (value === '' ? '""' : value)
  const decodeMissingValue = (value: string) => (value === '""' ? '' : value)
  return (
    <FormControl fullWidth>
      <Typography variant="h6">General</Typography>
      <TextField
        select
        label="Missing Values"
        margin="normal"
        value={descriptor.missingValues.map(encodeMissingValue) || []}
        onChange={(ev) =>
          // @ts-ignore
          update({ missingValues: ev.target.value.map(decodeMissingValue) })
        }
        SelectProps={{ multiple: true }}
      >
        {MISSING_VALUES.map((value) => (
          <MenuItem key={value} value={value}>
            {value}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        select
        label="Primary Key"
        margin="normal"
        value={descriptor.primaryKey || []}
        onChange={(ev) => update({ primaryKey: ev.target.value })}
        SelectProps={{ multiple: true }}
      >
        {descriptor.fields.map((field) => (
          <MenuItem key={field.name} value={field.name}>
            {field.name}
          </MenuItem>
        ))}
      </TextField>
      <Switch
        fullWidth
        size="large"
        color="info"
        variant="outlined"
        endIcon={page === 'foreignKeys' ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
        onClick={() => setPage('foreignKeys')}
      >
        Foreign Keys
      </Switch>
      <Switch
        fullWidth
        size="large"
        color="info"
        variant="outlined"
        endIcon={page === 'fields' ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
        onClick={() => setPage('fields')}
      >
        Fields
      </Switch>
    </FormControl>
  )
}

function ForeignKeys() {
  return (
    <FormControl fullWidth>
      <Typography variant="h6">Foreign Keys</Typography>
    </FormControl>
  )
}

function Fields() {
  const descriptor = useStore((state) => state.descriptor)
  const searchQuery = useStore((state) => state.searchQuery)
  const setSearchQuery = useStore((state) => state.setSearchQuery)
  const fields = searchQuery
    ? descriptor.fields.filter((field) => field.name.includes(searchQuery))
    : descriptor.fields
  return (
    <FormControl fullWidth>
      <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Fields
        <Search
          type="text"
          placeholder="Search..."
          value={searchQuery || ''}
          onChange={(ev) => setSearchQuery(ev.target.value)}
        />
      </Typography>
      <Box sx={{ maxHeight: '310px', overflowY: 'auto' }}>
        {fields.map((field) => (
          <Button
            fullWidth
            size="large"
            color="info"
            variant="outlined"
            endIcon={field.type.toUpperCase()}
            key={field.name}
            sx={{
              justifyContent: 'space-between',
              textTransform: 'initial',
              p: [2, 2],
              mt: 2,
            }}
          >
            {field.name}
          </Button>
        ))}
      </Box>
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
          overview
        </Typography>
        <Typography variant="body2">
          Table Schema is a specification for providing a schema (similar to a database
          schema) for tabular data. This information includes the expected data type for
          each value in a column , constraints on the value , and the expected format of
          the data.
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

const Switch = styled(Button)(({ theme }) => ({
  '&:hover': {
    borderColor: '#333',
    backgroundColor: 'white',
  },
  color: '#777',
  borderColor: '#ccc',
  justifyContent: 'space-between',
  textTransform: 'initial',
  padding: [theme.spacing(2), theme.spacing(2)],
  marginTop: theme.spacing(2),
}))

const Search = styled('input')({
  borderRadius: '4px',
  border: 'solid 1px #ccc',
  paddingLeft: '8px',
  paddingRight: '8px',
  '&:focus': {
    outline: 'none',
  },
})
