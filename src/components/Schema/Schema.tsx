import * as React from 'react'
import produce from 'immer'
import create from 'zustand'
import noop from 'lodash/noop'
import cloneDeep from 'lodash/cloneDeep'
import createContext from 'zustand/context'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
// import RemoveIcon from '@mui/icons-material/Remove'
// import AddIcon from '@mui/icons-material/Add'
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
  setField: (fieldIndex: number) => void
  updateField: (patch: object) => void
  removeField: () => void
  addField: () => void
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
    setField: (fieldIndex) => {
      set({ fieldIndex })
    },
    updateField: (patch) => {
      const { next, fieldIndex } = get()
      const schema = produce(next, (schema) => {
        schema.fields[fieldIndex] = { ...schema.fields[fieldIndex], ...patch }
      })
      set({ next: schema })
    },
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
    removeField: () => {
      const { next, fieldIndex } = get()
      const schema = produce(next, (schema) => {
        schema.fields.splice(fieldIndex, 1)
      })
      set({ next: schema, fieldIndex: Math.max(fieldIndex - 1, 0) })
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
  const update = useStore((state) => state.update)
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField
        label="Missing Values"
        margin="normal"
        value={schema.missingValues.join(',')}
        onChange={(ev) => update({ missingValues: ev.target.value.split(',') })}
      />
      <TextField
        label="Primary Key"
        margin="normal"
        value={(schema.primaryKey || []).join(',')}
        onChange={(ev) => update({ primaryKey: ev.target.value.split(',') })}
      />
      <TextField
        label="Foreign Keys"
        margin="normal"
        value={schema.foreignKeys || ''}
        onChange={(ev) => update({ foreignKeys: ev.target.value })}
        multiline
      />
    </FormControl>
  )
}

function Field() {
  const fieldIndex = useStore((state) => state.fieldIndex)
  const field = useStore((state) => state.next.fields[fieldIndex])
  const updateField = useStore((state) => state.updateField)
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField
        label="Name"
        margin="normal"
        value={field.name}
        onChange={(ev) => updateField({ name: ev.target.value })}
      />
      <TextField
        label="Type"
        margin="normal"
        value={field.type}
        onChange={(ev) => updateField({ type: ev.target.value })}
      />
      <TextField
        label="Format"
        margin="normal"
        value={field.format}
        onChange={(ev) => updateField({ format: ev.target.value })}
      />
    </FormControl>
  )
}

function Name() {
  const schema = useStore((state) => state.next)
  const fieldIndex = useStore((state) => state.fieldIndex)
  const setField = useStore((state) => state.setField)
  const addField = useStore((state) => state.addField)
  const removeField = useStore((state) => state.removeField)
  return (
    <Box>
      <Typography variant="h6">Name</Typography>
      <Box sx={{ pb: 2, borderBottom: 'dashed 1px #ccc' }}>
        <Button
          variant="outlined"
          color="success"
          sx={{ mt: 2, mr: 2 }}
          onClick={addField}
        >
          Add Field
        </Button>
        <Button
          variant="outlined"
          color="error"
          sx={{ mt: 2, mr: 2 }}
          onClick={removeField}
        >
          Remove Field
        </Button>
      </Box>
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
