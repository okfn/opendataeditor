import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MonacoEditor from '../../../Parts/Monaco/Editor'
import { useStore } from '../store'

export default function SourcePanel() {
  const theme = useTheme()
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!modified) return null
  return (
    <Box>
      <MonacoEditor
        value={JSON.stringify(modified, null, 2)}
        language="json"
        onChange={(text) => updateState({ modified: JSON.parse(text || '{)') })}
        height={theme.spacing(47)}
      />
    </Box>
  )
}
