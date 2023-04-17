import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MonacoEditor from '../../../Parts/Monaco/Editor'
import { useStore } from '../store'

export default function SourcePanel() {
  const theme = useTheme()
  const original = useStore((state) => state.original)
  if (!original) return null
  return (
    <Box>
      <MonacoEditor
        value={original}
        language="json"
        height={theme.spacing(47)}
        options={{ readOnly: true }}
      />
    </Box>
  )
}
