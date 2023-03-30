import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Menu from './Menu'
import Content from './Content'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const init = useStore((state) => state.init)
  // TODO: review
  const height = `calc(100vh - ${theme.spacing(24)})`
  React.useEffect(() => init(), [init])
  return (
    <Box sx={{ height }}>
      <Menu />
      <Content />
    </Box>
  )
}
