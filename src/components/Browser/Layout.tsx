import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '../Table'
import Header from './Header'
import { useStore } from './store'

// TODO: rebase from props to state
export default function Layout(props: { path?: string }) {
  const theme = useTheme()
  const headerHeight = theme.spacing(8)
  const client = useStore((state) => state.client)
  // const path = useStore((state) => state.path)
  return (
    <Box>
      <Box sx={{ height: headerHeight }}>
        <Header path={props.path} />
      </Box>
      <Box>{props.path && <Table client={client} path={props.path} />}</Box>
    </Box>
  )
}
