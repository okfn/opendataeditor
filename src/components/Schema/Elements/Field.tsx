import * as React from 'react'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import MissingValues from '../Library/MissingValues'
import * as settings from '../settings'
import { useStore } from '../store'

export default function Field() {
  const elementIndex = useStore((state) => state.elementIndex) as number
  const updateField = useStore((state) => state.updateField)
  const field = useStore((state) => state.descriptor.fields[elementIndex])
  // @ts-ignore
  const FIELD = settings.FIELDS[field.type]
  return (
    <Grid container spacing={3}>
      <Grid item xs={6}>
        <TextField
          fullWidth
          label="Name"
          margin="normal"
          value={field.name}
          onChange={(ev) => updateField({ name: ev.target.value })}
        />
        <Grid container spacing={1}>
          <Grid item xs={6}>
            <TextField
              select
              fullWidth
              label="Type"
              margin="normal"
              value={field.type}
              onChange={(ev) => updateField({ type: ev.target.value })}
            >
              {Object.keys(settings.FIELDS).map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={6}>
            {FIELD.formats.includes('*') ? (
              <TextField
                fullWidth
                label="Format"
                margin="normal"
                value={field.format}
                onChange={(ev) => updateField({ format: ev.target.value })}
              />
            ) : (
              <TextField
                select
                fullWidth
                label="Format"
                margin="normal"
                value={field.format}
                disabled={FIELD.formats.length < 2}
                onChange={(ev) => updateField({ format: ev.target.value })}
              >
                {FIELD.formats.map((format: string) => (
                  <MenuItem key={format} value={format}>
                    {format}
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Grid>
        </Grid>
        <TextField
          fullWidth
          label="Title"
          margin="normal"
          value={field.title || ''}
          onChange={(ev) => updateField({ title: ev.target.value })}
        />
        <TextField
          fullWidth
          label="Description"
          margin="normal"
          value={field.description || ''}
          onChange={(ev) => updateField({ description: ev.target.value })}
          multiline
        />
      </Grid>
      <Grid item xs={6}>
        <MissingValues
          value={field.missingValues || []}
          handleChange={(missingValues) => updateField({ missingValues })}
        />
        <TextField
          fullWidth
          label="RDF Type"
          margin="normal"
          value={field.rdfType || ''}
          onChange={(ev) => updateField({ rdfType: ev.target.value })}
        />
      </Grid>
    </Grid>
  )
}
