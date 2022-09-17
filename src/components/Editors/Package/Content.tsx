import * as React from 'react'
import Box from '@mui/material/Box'
import Package from '../../Views/Package'
// import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  // const theme = useTheme()
  const path = useStore((state) => state.record.path)
  const dp = useStore((state) => state.package)
  const loadPackage = useStore((state) => state.loadPackage)
  React.useEffect(() => {
    loadPackage().catch(console.error)
  }, [path])
  if (!dp) return null
  return (
    <Box sx={{ paddingX: 2 }}>
      <Package package={dp} />
    </Box>
  )
}
