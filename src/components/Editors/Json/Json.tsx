import * as React from 'react'
import Box from '@mui/material/Box'
import { DataObject, Handyman } from '@mui/icons-material'
import { useTheme } from '@mui/material/styles'
import MenuBar from '../../Parts/MenuBar'
import Editor, { OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
// @ts-expect-error
import dirtyJson from 'dirty-json'

interface JsonProps {
  path: string
  json: string
  onChange: (value: any) => void
}

export default function Json(props: JsonProps) {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(30)})`
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)

  const items = [
    {
      key: 'fix',
      label: 'Fix',
      icon: <Handyman />,
      disabled: false,
      onClick: handleFixClick,
    },
    {
      key: 'prettify',
      label: 'Prettify',
      icon: <DataObject />,
      disabled: false,
      onClick: handlePrettifyClick,
    },
  ]

  // Helper functions

  const prettifyJsonString = (jsonString: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, '\t')
    } catch (err) {
      return jsonString
    }
  }

  // Actions

  const handleEditorChange = (value: any) => {
    const bytes = new TextEncoder().encode(value)
    const blob = new Blob([bytes], { type: 'application/json;charset=utf-8' })
    const file = new File([blob], props.path)
    props.onChange(file)
  }

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  function handleFixClick() {
    const editor = editorRef.current
    const value = editor && editor.getValue()
    const fixedValue = value && dirtyJson.parse(value)
    const formattedValue = fixedValue && prettifyJsonString(JSON.stringify(fixedValue))
    editor && editor.setValue(formattedValue)
  }

  function handlePrettifyClick() {
    const action = editorRef.current?.getAction('editor.action.formatDocument')
    if (!action) return
    action.run()
  }

  return (
    <Box height={height}>
      <MenuBar items={items} />
      <Editor
        language="json"
        defaultValue={props.json}
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
