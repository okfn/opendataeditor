import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

interface SchemaProps {
  state: any
}

export default function Schema(props: SchemaProps) {
  const { resource } = props.state
  return (
    <Grid container>
      <Grid item xs={6}>
        <Typography variant="h6">Field</Typography>
        <FormControl>
          <TextField
            label="Name"
            margin="normal"
            defaultValue={resource.schema.fields[0].name}
          />
          <TextField
            label="Type"
            margin="normal"
            defaultValue={resource.schema.fields[0].type}
          />
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <Typography variant="h6">Select</Typography>
        <Box>
          {resource.schema.fields.map((field: any, index: any) => (
            <Button
              variant={index === 0 ? 'contained' : 'outlined'}
              key={field.name}
              sx={{ mt: 1, mr: 2 }}
            >
              {field.name}
            </Button>
          ))}
        </Box>
      </Grid>
    </Grid>
  )
}
