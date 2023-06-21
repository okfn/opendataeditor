import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextEditor from '../../../Parts/Text'
import { useStore } from '../store'

export default function SourcePanel() {
  const theme = useTheme()
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!modified) return null
  return (
    <Box>
      <TextEditor
        value={JSON.stringify(modified, null, 2)}
        language="json"
        onChange={(text) => {
          try {
            updateState({ modified: JSON.parse(text || '{)') })
          } catch (error) {}
        }}
        height={theme.spacing(47)}
      />
    </Box>
  )
}
