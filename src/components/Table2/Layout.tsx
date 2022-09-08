import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Editor from './Editor'
import Source from '../Source'
import Report from '../Report'
import Resource from '../Resource'
import { useStore } from './store'

export default function Layout() {
  const resource = useStore((state) => state.resource)
  const isMetadataOpen = useStore((state) => state.isMetadataOpen)
  const updateResource = useStore((state) => state.updateResource)
  return (
    <React.Fragment>
      <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box>
          <View />
        </Box>
        <Box sx={{ marginTop: 'auto' }}>
          <Actions />
        </Box>
      </Box>
      {isMetadataOpen && (
        <Box>
          <Resource descriptor={resource} withTabs={true} onCommit={updateResource} />
        </Box>
      )}
    </React.Fragment>
  )
}

function View() {
  const viewType = useStore((state) => state.viewType)
  const report = useStore((state) => state.report)
  const source = useStore((state) => state.source)
  switch (viewType) {
    case 'source':
      return source ? <Source source={source} /> : null
    case 'report':
      return report ? <Report descriptor={report} /> : null
    default:
      return <Editor />
  }
}
