import * as React from 'react'
import Box from '@mui/material/Box'
import MonacoEditor from '@monaco-editor/react'
import { useStore, selectors } from './store'

export default function Editor() {
  const modified = useStore((state) => state.modified)
  const editor = useStore((state) => state.editor)
  const language = useStore(selectors.language)
  const updateState = useStore((state) => state.updateState)
  if (modified === undefined) return null
  return (
    <Box sx={{ paddingY: 2, height: '100%' }}>
      <MonacoEditor
        value={modified}
        language={language}
        options={{
          automaticLayout: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
        onChange={(text) => updateState({ modified: text })}
        onMount={(ref) => {
          console.log(ref)
          // @ts-ignore
          editor.current = ref
        }}
      />
    </Box>
  )
}
