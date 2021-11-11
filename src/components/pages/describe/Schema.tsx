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
  return (
    <Grid container>
      <Grid item xs={3}>
        <General state={props.state} />
      </Grid>
      <Grid item xs={3}>
        <Field state={props.state} />
      </Grid>
      <Grid item xs={6}>
        <Name state={props.state} />
      </Grid>
    </Grid>
  )
}

function General(props: SchemaProps) {
  const { schema } = props.state.resource
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

function Field(props: SchemaProps) {
  const { schema } = props.state.resource
  return (
    <FormControl>
      <Typography variant="h6">Field</Typography>
      <TextField label="Name" margin="normal" defaultValue={schema.fields[0].name} />
      <TextField label="Type" margin="normal" defaultValue={schema.fields[0].type} />
      <TextField label="Format" margin="normal" defaultValue={schema.fields[0].format} />
    </FormControl>
  )
}

function Name(props: SchemaProps) {
  const { schema } = props.state.resource
  return (
    <Box>
      <Typography variant="h6">Name</Typography>
      <Box>
        {schema.fields.map((field: any, index: any) => (
          <Button
            variant={index === 0 ? 'contained' : 'outlined'}
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
