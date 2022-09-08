import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '../Table'
import Header from './Header'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const headerHeight = theme.spacing(8)
  const session = useStore((state) => state.session)
  const path = useStore((state) => state.path)
  return (
    <Box>
      <Box sx={{ height: headerHeight }}>
        <Header />
      </Box>
      <Box>{path && <Table session={session} path={path} />}</Box>
    </Box>
  )
}
