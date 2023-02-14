import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import MetadataPanel from './Panels/Metadata'
import ErrorsPanel from './Panels/Errors'
import ChangesPanel from './Panels/Changes'
import SourcePanel from './Panels/Source'
import Actions from './Actions'
import Content from './Content'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + panelHeight)})`
  const path = useStore((state) => state.file.path)
  const loadTable = useStore((state) => state.loadTable)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    // TODO: rework
    loadTable().catch(console.error)
    loadSource().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: contentHeight }}>
          <Content />
        </Box>
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
          {panel === 'errors' && <ErrorsPanel />}
          {panel === 'changes' && <ChangesPanel />}
          {panel === 'source' && <SourcePanel />}
        </Box>
        <Box sx={{ height: theme.spacing(8) }}>
          <Actions />
        </Box>
      </Box>
    </React.Fragment>
  )
}
