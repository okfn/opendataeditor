import * as React from 'react'
import Box from '@mui/material/Box'
import ImageList from '@mui/material/ImageList'
import ImageListItem from '@mui/material/ImageListItem'
import Resource from './Resource'
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
      <ImageList cols={4} gap={16}>
        {dp.resources.map((resource) => (
          <ImageListItem key={resource.name}>
            <Resource resource={resource} />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  )
}
