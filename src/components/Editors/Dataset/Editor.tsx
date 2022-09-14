import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Editor(props: { editable?: boolean }) {
  const path = useStore((state) => state.path)
  const loadEverything = useStore((state) => state.loadEverything)
  React.useEffect(() => {
    loadEverything().catch(console.error)
  }, [path])
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6 + (props.editable ? 8 : 56))})`
  return <Box sx={{ height, padding: 2 }}>No data view available</Box>
}
