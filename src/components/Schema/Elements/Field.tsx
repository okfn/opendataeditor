import * as React from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { useStore } from '../store'

export default function Field() {
  const elementIndex = useStore((state) => state.elementIndex)
  const updateField = useStore((state) => state.updateField)
  if (elementIndex === undefined) return null
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <TextField
            label="Name"
            margin="normal"
            value={field.name}
            onChange={(ev) => updateField({ name: ev.target.value })}
          />
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <TextField
                label="Type"
                margin="normal"
                value={field.type}
                onChange={(ev) => updateField({ type: ev.target.value })}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Format"
                margin="normal"
                value={field.format}
                onChange={(ev) => updateField({ format: ev.target.value })}
              />
            </Grid>
          </Grid>
          <TextField
            label="Title"
            margin="normal"
            value={field.title || ''}
            onChange={(ev) => updateField({ title: ev.target.value })}
          />
          <TextField
            label="Description"
            margin="normal"
            value={field.description || ''}
            onChange={(ev) => updateField({ description: ev.target.value })}
            multiline
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <TextField
            label="RDF Type"
            margin="normal"
            value={field.rdfType || ''}
            onChange={(ev) => updateField({ rdfType: ev.target.value })}
          />
        </FormControl>
      </Grid>
    </Grid>
  )
}
