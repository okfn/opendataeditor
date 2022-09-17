import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const path = useStore((state) => state.record.path)
  const dp = useStore((state) => state.package)
  const loadPackage = useStore((state) => state.loadPackage)
  React.useEffect(() => {
    loadPackage().catch(console.error)
  }, [path])
  if (!dp) return null
  return (
    <Box sx={{ padding: 2 }}>
      {dp.resources.map((resource) => (
        <Box
          key={resource.name}
          sx={{
            border: 1,
            borderColor: 'divider',
            height: theme.spacing(16),
            width: theme.spacing(16),
          }}
        >
          <h2>{resource.name}</h2>
        </Box>
      ))}
    </Box>
  )
}
