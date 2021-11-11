import * as React from 'react'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'

interface FeaturesProps {
  state: any
  dispatch: any
}

export default function Features(props: FeaturesProps) {
  return (
    <Grid container>
      <Grid item xs={3}>
        <Layout state={props.state} dispatch={props.dispatch} />
      </Grid>
      <Grid item xs={3}>
        <Dialect state={props.state} dispatch={props.dispatch} />
      </Grid>
      <Grid item xs={3}>
        <Control />
      </Grid>
    </Grid>
  )
}

function Layout(props: FeaturesProps) {
  const { layout } = props.state.resource
  return (
    <FormControl>
      <Typography variant="h6">Layout</Typography>
      <TextField
        select
        margin="normal"
        label="Header"
        defaultValue={layout.header ? 'true' : 'false'}
        sx={{ width: '200px' }}
      >
        <MenuItem value={'true'}>Yes</MenuItem>
        <MenuItem value={'false'}>No</MenuItem>
      </TextField>
    </FormControl>
  )
}

function Dialect(props: FeaturesProps) {
  // TODO: handle different format
  const { dialect } = props.state.resource
  return (
    <FormControl>
      <Typography variant="h6">Dialect</Typography>
      <TextField label="Delimiter" margin="normal" defaultValue={dialect.delimiter} />
    </FormControl>
  )
}

function Control() {
  return (
    <Box>
      <Typography variant="h6">Control</Typography>
      <Box sx={{ mt: 1 }}>No supported options</Box>
    </Box>
  )
}
