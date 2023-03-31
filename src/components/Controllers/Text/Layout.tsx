import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import ScrollBox from '../../Parts/ScrollBox'
import MetadataPanel from './Panels/Metadata'
import Actions from './Actions'
import Editor from './Editor'
import Dialog from './Dialog'
import Menu from './Menu'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const file = useStore((state) => state.file)
  const panel = useStore((state) => state.panel)
  const load = useStore((state) => state.load)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + panelHeight)})`
  React.useEffect(() => {
    load().catch(console.error)
  }, [file])
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Menu />
        <ScrollBox height={contentHeight}>
          <Editor />
        </ScrollBox>
        <Box
          hidden={!panel}
          sx={{
            overflowY: 'auto',
            height: theme.spacing(48),
            borderTop: 1,
            borderColor: 'divider',
            paddingX: 2,
          }}
        >
          {panel === 'metadata' && <MetadataPanel />}
        </Box>
        <Actions />
      </Box>
    </React.Fragment>
  )
}
