import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Editor, { OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import Delete from '@mui/icons-material/Delete'
import MenuBar from '../../Parts/Monaco/MenuBar'

interface TextProps {
  value: string
  language?: string
  onChange: (value: any) => void
}

export default function Text(props: TextProps) {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(24)})`
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)
  const items = [
    {
      key: 'clear',
      label: 'Clear',
      disabled: false,
      type: 'default',
      icon: <Delete />,
      onClick: () => editorRef.current?.setValue(''),
    },
  ]

  // Actions

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }
  return (
    <Box height={height}>
      <MenuBar items={items} />
      <Editor
        language={props.language}
        value={props.value}
        options={{
          automaticLayout: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
        onChange={(value) => props.onChange(value)}
        onMount={handleEditorDidMount}
      />
    </Box>
  )
}
