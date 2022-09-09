import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Editor() {
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [])
  return <Box sx={{ padding: 2 }}>No data view available</Box>
}
