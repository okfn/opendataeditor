import * as React from 'react'
import Box from '@mui/material/Box'
import PreviewPanel from './Panels/Preview'
import ScrollBox from '../../Parts/ScrollBox'
import Actions from './Actions'
import Dialog from './Dialog'
import Editor from './Editor'
import Menu from './Menu'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  const height = `calc(100vh - ${theme.spacing(8)})`
  const panelHeight = panel ? 48 : 0
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8 + panelHeight)})`
  const file = useStore((state) => state.file)
  const modified = useStore((state) => state.modified)
  const load = useStore((state) => state.load)
  React.useEffect(() => {
    load().catch(console.error)
  }, [file])
  if (!modified) return null
  return (
    <React.Fragment>
      <Dialog />
      <Box sx={{ height }}>
        <Menu />
        <ScrollBox height={contentHeight}>
          <Editor />
        </ScrollBox>
        <Box
          hidden={!panel}
          sx={{
            overflowY: 'hidden',
            height: theme.spacing(48),
            border: 'solid 3px #000',
            padding: 2,
            backgroundColor: '#333',
            color: '#eee',
            fontSize: '80%',
          }}
        >
          {panel === 'preview' && <PreviewPanel />}
        </Box>
        <Actions />
      </Box>
    </React.Fragment>
  )
}
