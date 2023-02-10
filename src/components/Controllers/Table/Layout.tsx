import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Content from './Content'
import Menu from './Menu'
import Resource from '../../Editors/Resource'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const isMetadata = useStore((state) => state.isMetadata)
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const panelHeight = isMetadata ? 56 : 8
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 6 + panelHeight)})`
  const resource = useStore((state) => state.file.record?.resource)
  const updateResource = useStore((state) => state.updateResource)
  const updateColumn = useStore((state) => state.updateColumn)
  return (
    <Box sx={{ position: 'relative' }}>
      <Menu />
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: contentHeight, overflowY: 'auto', overflowX: 'hidden' }}>
          <Content height={contentHeight} />
        </Box>
        <Box sx={{ marginTop: 'auto' }}>
          <Box
            hidden={!isMetadata}
            sx={{ borderTop: 1, borderColor: 'divider', paddingX: 2 }}
          >
            <Resource
              resource={resource}
              withTabs={true}
              onCommit={updateResource}
              onChangeColumn={(selectedColumn) => {
                updateColumn(selectedColumn)
              }}
            />
          </Box>
          <Box hidden={isMetadata}>
            <Actions />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
