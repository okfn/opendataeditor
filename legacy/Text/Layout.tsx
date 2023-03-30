import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Menu from './Menu'
import MainEditor from './Editors/Main'
import DiffEditor from './Editors/Diff'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const diff = useStore((state) => state.diff)
  const init = useStore((state) => state.init)
  // TODO: review
  const height = `calc(100vh - ${theme.spacing(24)})`
  React.useEffect(() => init(), [init])
  return (
    <Box sx={{ height }}>
      {diff ? (
        <DiffEditor />
      ) : (
        <React.Fragment>
          <Menu />
          <MainEditor />
        </React.Fragment>
      )}
    </Box>
  )
}
