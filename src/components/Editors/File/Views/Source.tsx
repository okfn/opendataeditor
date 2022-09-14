import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Source from '../../Source'
import { useStore } from '../store'

export default function SourceView() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const path = useStore((state) => state.path)
  const source = useStore((state) => state.source)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    loadSource().catch(console.error)
  }, [path])
  if (!source) return null
  return (
    <Box sx={{ padding: 2, height, overflowY: 'auto' }}>
      <Source source={source} />
    </Box>
  )
}
