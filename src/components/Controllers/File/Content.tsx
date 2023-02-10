import * as React from 'react'
import Box from '@mui/material/Box'
import Source from '../../Editors/Source'
import { useStore } from './store'

export default function Content() {
  const format = useStore((state) => state.file.record?.resource.format)
  if (['jpg', 'png'].includes(format || '')) return <ContentImage />
  return <ContentText />
}

function ContentImage() {
  const path = useStore((state) => state.file.path)
  const format = useStore((state) => state.file.record?.resource.format)
  const bytes = useStore((state) => state.bytes)
  const loadBytes = useStore((state) => state.loadBytes)
  React.useEffect(() => {
    loadBytes().catch(console.error)
  }, [path])
  if (!bytes) return null
  return (
    <Box sx={{ padding: 2 }}>
      <img src={`data:image/${format};base64,${bytes}`} />
    </Box>
  )
}

function ContentText() {
  const path = useStore((state) => state.file.path)
  const text = useStore((state) => state.text)
  const loadText = useStore((state) => state.loadText)
  React.useEffect(() => {
    loadText().catch(console.error)
  }, [path])
  if (!text) return null
  return (
    <Box sx={{ padding: 2 }}>
      <Source source={text} />
    </Box>
  )
}
