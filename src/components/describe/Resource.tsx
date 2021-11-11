import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'

interface ResourceProps {
  state: any
  dispatch: any
}

export default function Resource(props: ResourceProps) {
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
        defaultValue={resource.description || ''}
      />
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
