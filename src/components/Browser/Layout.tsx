import * as React from 'react'
import Box from '@mui/material/Box'
import File from '../File'
import Table from '../Table'
import Header from './Header'
import Dataset from '../Dataset'
import { useStore } from './store'

export default function Layout() {
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Box>
        <Header />
      </Box>
      <Box>
        <Router />
      </Box>
    </Box>
  )
}

function Router() {
  const path = useStore((state) => state.path)
  const client = useStore((state) => state.client)
  if (!path) return null
  if (path.endsWith('datapackage.json') || path.endsWith('datapackage.yaml')) {
    return <Dataset client={client} path={path} />
  }
  if (path.endsWith('.csv')) return <Table client={client} path={path} />
  return <File client={client} path={path} />
}
