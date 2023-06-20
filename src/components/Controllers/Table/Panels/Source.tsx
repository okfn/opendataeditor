import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import TextEditor from '../../../Editors/Text'
import { useStore } from '../store'

export default function SourcePanel() {
  const theme = useTheme()
  const record = useStore((state) => state.record)
  const source = useStore((state) => state.source)
  const loadSource = useStore((state) => state.loadSource)
  React.useEffect(() => {
    loadSource().catch(console.error)
  }, [record])
  if (!source) return null
  return (
    <Box>
      <TextEditor
        value={source}
        language="json"
        height={theme.spacing(47)}
        options={{ readOnly: true }}
      />
    </Box>
  )
}
