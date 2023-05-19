import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import Actions from './Actions'
import Controller from './Controller'
import Dialog from './Dialog'
import Header from './Header'
import Files from './Files'
import Project from './Project'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8)})`
  const path = useStore((state) => state.path)
  const load = useStore((state) => state.load)
  React.useEffect(() => {
    load().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Dialog />
      <Header />
      <Columns layout={[3, 9]}>
        <Box sx={{ height, borderRight: 'solid 1px #ddd' }}>
          <Project />
          <Box sx={{ height: contentHeight }}>
            <Files />
          </Box>
          <Actions />
        </Box>
        <Controller />
      </Columns>
    </React.Fragment>
  )
}
