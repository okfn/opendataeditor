import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Editor, { OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { Delete } from '@mui/icons-material'
import MenuBar from '../../Parts/MenuBar'

interface TextProps {
  path: string
  text: string
  onChange: (value: any) => void
}

export default function Text(props: TextProps) {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(30)})`
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)
  const language = getLanguage(props.path)
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

  const handleEditorChange = (value: any) => {
    const bytes = new TextEncoder().encode(value)
    const blob = new Blob([bytes], { type: 'application/text;charset=utf-8' })
    const file = new File([blob], props.path)
    props.onChange(file)
  }

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }
  return (
    <Box height={height}>
      <MenuBar items={items} />
      <Editor
        language={language}
        defaultValue={props.text}
        options={{
          automaticLayout: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
      />
    </Box>
  )
}

// TODO: temporary solution
const getLanguage = (path: string) => {
  const extension = path.split('.').slice(-1).join()
  const language = languages[extension]
  if (language) return language
  return 'plaintext'
}

const languages: { [key: string]: string } = {
  md: 'markdown',
  txt: 'plaintext',
}
