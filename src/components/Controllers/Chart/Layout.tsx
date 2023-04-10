import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../Parts/ScrollBox'
import Actions from './Actions'
import Editor from './Editor'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(90vh - ${theme.spacing(8)})`
  const contentHeight = `calc(90vh - ${theme.spacing(8 + 8)})`
  const loadFields = useStore((state) => state.loadFields)
  const path = useStore((state) => state.file?.path)
  React.useEffect(() => {
    loadFields().catch(console.error)
  }, [path])
  return (
    <React.Fragment>
      <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
        <ScrollBox height={contentHeight}>
          <Editor />
        </ScrollBox>
        <Actions />
      </Box>
    </React.Fragment>
  )
}
