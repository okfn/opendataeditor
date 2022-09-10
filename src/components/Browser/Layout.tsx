import * as React from 'react'
import Box from '@mui/material/Box'
import File from '../File'
import Table from '../Table'
import Header from './Header'
import Dataset from '../Dataset'
import { useStore } from './store'

// TODO: rebase from props to state
export default function Layout(props: { path?: string }) {
  // const path = useStore((state) => state.path)
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Box>
        <Header path={props.path} />
      </Box>
      <Box>
        <Router path={props.path} />
      </Box>
    </Box>
  )
}

function Router(props: { path?: string }) {
  if (!props.path) return null
  const client = useStore((state) => state.client)
  if (
    props.path.endsWith('datapackage.json') ||
    props.path.endsWith('datapackage.yaml')
  ) {
    return <Dataset client={client} path={props.path} />
  }
  if (props.path.endsWith('.csv')) return <Table client={client} path={props.path} />
  return <File client={client} path={props.path} />
}
