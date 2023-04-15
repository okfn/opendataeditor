import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Editor from './Editor'
import Dialog from './Dialog'
import Menu from './Menu'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8)})`
  const path = useStore((state) => state.path)
  const listFiles = useStore((state) => state.listFiles)
  const countFiles = useStore((state) => state.countFiles)
  const setDialog = useStore((state) => state.setDialog)
  React.useEffect(() => {
    listFiles().catch(console.error)
    countFiles()
      .then((result) => {
        if (result <= 0) setDialog('create/dialog')
      })
      .catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Menu />
        <Box sx={{ height: contentHeight }}>
          <Editor />
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </React.Fragment>
  )
}
