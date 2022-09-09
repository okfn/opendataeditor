import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import File from '../File'
import Table from '../Table'
import Header from './Header'
import { useStore } from './store'

// TODO: rebase from props to state
export default function Layout(props: { path?: string }) {
  const theme = useTheme()
  const headerHeight = theme.spacing(8)
  // const path = useStore((state) => state.path)
  return (
    <Box>
      <Box sx={{ height: headerHeight }}>
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
  if (props.path.endsWith('.csv')) return <Table client={client} path={props.path} />
  return <File client={client} path={props.path} />
}
