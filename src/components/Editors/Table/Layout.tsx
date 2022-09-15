import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Content from './Content'
import Resource from '../../Views/Resource'
import { useStore } from './store'

export default function Layout() {
  const isMetadata = useStore((state) => state.isMetadata)
  return isMetadata ? <MetadataLayout /> : <DataLayout />
}

function DataLayout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 6 + 8)})`
  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Content height={contentHeight} />
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Actions />
      </Box>
    </Box>
  )
}

function MetadataLayout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 6 + 56)})`
  const resource = useStore((state) => state.record.resource)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <Content height={contentHeight} />
      </Box>
      <Box sx={{ marginTop: 'auto', borderTop: 'solid 1px #ddd', paddingX: 2 }}>
        <Resource resource={resource} withTabs={true} onCommit={updateResource} />
      </Box>
    </Box>
  )
}
