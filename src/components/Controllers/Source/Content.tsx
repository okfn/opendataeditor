import * as React from 'react'
import Box from '@mui/material/Box'
import Source from '../../Editors/Source'
import { useStore } from './store'

export default function Content() {
  const path = useStore((state) => state.record.path)
  const source = useStore((state) => state.source)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    loadSource().catch(console.error)
  }, [path])
  if (!source) return null
  return (
    <Box sx={{ padding: 2 }}>
      <Source source={source} />
    </Box>
  )
}
