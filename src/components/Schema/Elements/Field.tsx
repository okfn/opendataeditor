import * as React from 'react'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import { useStore } from '../store'

export default function Field() {
  const elementIndex = useStore((state) => state.elementIndex)
  const removeField = useStore((state) => state.removeField)
  const updateField = useStore((state) => state.updateField)
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  if (!field) return null
  return (
    <FormControl fullWidth>
      <Typography variant="h6">
        Fields &raquo; {field.name}
        <Button sx={{ m: 0, p: 0, ml: 2 }} onClick={() => removeField()}>
          Remove Field
        </Button>
      </Typography>
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
    </FormControl>
  )
}
