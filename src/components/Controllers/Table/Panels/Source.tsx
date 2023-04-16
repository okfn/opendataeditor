import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MonacoEditor from '../../../Parts/Monaco/Editor'
import { useStore } from '../store'

export default function SourcePanel() {
  const theme = useTheme()
  const source = useStore((state) => state.source)
  if (!source) return null
  return (
    <Box>
      <MonacoEditor
        value={source}
        language="json"
        height={theme.spacing(47)}
        options={{ readOnly: true }}
      />
    </Box>
  )
}
