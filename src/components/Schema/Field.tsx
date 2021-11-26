import * as React from 'react'
// import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import { useStore } from './store'

export default function Field() {
  const elementIndex = useStore((state) => state.elementIndex)
  if (elementIndex === undefined) return null
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  return (
    <FormControl fullWidth>
      <Typography variant="h6">Fields &raquo; {field.name}</Typography>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField label="Name" margin="normal" value={field.name} />
            <Grid container spacing={1}>
              <Grid item xs={6}>
                <TextField label="Type" margin="normal" value={field.type} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Format" margin="normal" value={field.format} />
              </Grid>
            </Grid>
            <TextField label="Title" margin="normal" value={field.title || ''} />
            <TextField
              label="Description"
              margin="normal"
              value={field.description || ''}
              multiline
            />
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <TextField label="RDF Type" margin="normal" value={field.rdfType || ''} />
          </FormControl>
        </Grid>
      </Grid>
    </FormControl>
  )
}
