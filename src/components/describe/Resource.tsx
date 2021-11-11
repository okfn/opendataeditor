import * as React from 'react'
import capitalize from 'lodash/capitalize'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid'

interface ResourceProps {
  state: any
  dispatch: any
}

export default function Resource(props: ResourceProps) {
  return (
    <Grid container>
      <Grid item xs={3}>
        <General state={props.state} dispatch={props.dispatch} />
      </Grid>
      <Grid item xs={3}>
        <Details state={props.state} dispatch={props.dispatch} />
      </Grid>
      <Grid item xs={3}>
        <Stats state={props.state} dispatch={props.dispatch} />
      </Grid>
    </Grid>
  )
}

function General(props: ResourceProps) {
  const { resource } = props.state
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      <TextField label="Path" margin="normal" defaultValue={resource.path} disabled />
      <TextField
        label="Name"
        margin="normal"
        defaultValue={resource.name}
        onChange={(ev) =>
          props.dispatch({
            type: 'UPDATE_RESOURCE',
            update: { name: ev.target.value },
          })
        }
      />
      <TextField label="Title" margin="normal" defaultValue={resource.title || ''} />
      <TextField
        label="Description"
        margin="normal"
        multiline
        defaultValue={resource.description || ''}
      />
    </FormControl>
  )
}

function Details(props: ResourceProps) {
  const { resource } = props.state
  return (
    <FormControl>
      <Typography variant="h6">Details</Typography>
      <TextField label="Scheme" margin="normal" defaultValue={resource.scheme || ''} />
      <TextField label="Format" margin="normal" defaultValue={resource.format || ''} />
      <TextField label="Hashing" margin="normal" defaultValue={resource.hashing || ''} />
      <TextField
        label="Encoding"
        margin="normal"
        defaultValue={resource.encoding || ''}
      />
    </FormControl>
  )
}

function Stats(props: ResourceProps) {
  const keys = ['hash', 'bytes', 'fields', 'rows']
  const { resource } = props.state
  return (
    <FormControl>
      <Typography variant="h6">Stats</Typography>
      {keys.map((key) => (
        <TextField
          key={key}
          disabled
          margin="normal"
          label={capitalize(key)}
          defaultValue={resource.stats[key]}
        />
      ))}
    </FormControl>
  )
}
