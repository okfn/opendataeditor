import lodash from 'lodash'
import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'

interface StatsProps {
  state: any
}

export default function Stats(props: StatsProps) {
  const keys = ['hash', 'bytes', 'fields', 'rows']
  const { resource } = props.state
  return (
    <FormControl>
      <Typography variant="h6">General</Typography>
      {keys.map((key) => (
        <TextField
          key={key}
          disabled
          margin="normal"
          label={lodash.capitalize(key)}
          defaultValue={resource.stats[key]}
        />
      ))}
    </FormControl>
  )
}
