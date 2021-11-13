import * as React from 'react'
import produce from 'immer'
import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import { ISchema } from '../../interfaces/schema'
import * as helpers from '../../helpers'

export interface SchemaProps {
  schema: ISchema
  onSave?: (schema: ISchema) => void
}

interface SchemaState {
  next: ISchema
  prev: ISchema
  onSave: (schema: ISchema) => void
  isPreview: boolean
  isUpdated: boolean
  fieldIndex: number
  addField: () => void
  setField: (fieldIndex: number) => void
  update: (patch: object) => void
  preview: () => void
  revert: () => void
  save: () => void
}

function makeStore(props: SchemaProps) {
  const schema = props.schema
  const onSave = props.onSave || noop
  return create<SchemaState>((set, get) => ({
    next: cloneDeep(schema),
    prev: schema,
    onSave,
    isPreview: false,
    isUpdated: false,
    fieldIndex: 0,
    addField: () => {
      const { next } = get()
      const schema = produce(next, (schema) => {
        schema.fields.push({
          name: `field${next.fields.length}`,
          type: 'string',
          format: 'default',
        })
      })
      const fieldIndex = schema.fields.length - 1
      set({ next: schema, fieldIndex })
    },
    setField: (fieldIndex) => {
      set({ fieldIndex })
    },
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
    <Grid container>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={3}>
        <Field />
      </Grid>
      <Grid item xs={6}>
        <Name />
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

function General() {
  const schema = useStore((state) => state.next)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        label="Missing Values"
        margin="normal"
        defaultValue={schema.missingValues}
      />
      <TextField label="Primary Key" margin="normal" defaultValue={schema.primaryKey} />
    </FormControl>
  )
}

function Field() {
  const fieldIndex = useStore((state) => state.fieldIndex)
  const field = useStore((state) => state.next.fields[fieldIndex])
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField label="Name" margin="normal" value={field.name} />
      <TextField label="Type" margin="normal" value={field.type} />
      <TextField label="Format" margin="normal" value={field.format} />
    </FormControl>
  )
}

function Name() {
  const schema = useStore((state) => state.next)
  const fieldIndex = useStore((state) => state.fieldIndex)
  const addField = useStore((state) => state.addField)
  const setField = useStore((state) => state.setField)
  return (
    <Box>
      <Typography variant="h6">Name</Typography>
      <Box>
        {schema.fields.map((field: any, index: any) => (
          <Button
            variant={index === fieldIndex ? 'contained' : 'outlined'}
            onClick={() => setField(index)}
            key={field.name}
            sx={{ mt: 2, mr: 2 }}
          >
            {field.name}
          </Button>
        ))}
        <Button variant="outlined" sx={{ mt: 2, mr: 2 }} onClick={addField}>
          <AddIcon />
        </Button>
      </Box>
    </Box>
  )
}

function Actions() {
  const schema = useStore((state) => state.next)
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
          download={'schema.json'}
          href={helpers.exportDescriptor(schema)}
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
