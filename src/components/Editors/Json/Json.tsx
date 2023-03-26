import * as React from 'react'
import Box from '@mui/material/Box'
import Compress from '@mui/icons-material/Compress'
import DataObject from '@mui/icons-material/DataObject'
import Delete from '@mui/icons-material/Delete'
import Handyman from '@mui/icons-material/Handyman'
import { useTheme } from '@mui/material/styles'
import MenuBar from '../../Parts/Monaco/MenuBar'
import Editor, { OnMount } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
// @ts-expect-error
import dirtyJson from 'dirty-json'

// TODO: merge into Text editor?
interface JsonProps {
  value: string
  onChange: (value: any) => void
}

export default function Json(props: JsonProps) {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(24)})`
  const editorRef = React.useRef<editor.IStandaloneCodeEditor | null>(null)
  const [isAutoPrettifyOn, toggleAutoPrettifyOn] = React.useState(false)
  const [isChanged, setIsChanged] = React.useState(false)

  // MenuBar items

  const menuBarItems = [
    {
      key: 'clear',
      label: 'Clear',
      disabled: false,
      type: 'default',
      icon: <Delete />,
      onClick: () => editorRef.current?.setValue(''),
    },
    {
      key: 'fix',
      label: 'Fix',
      disabled: false,
      type: 'default',
      icon: <Handyman />,
      onClick: handleFixClick,
    },
    {
      key: 'minify',
      label: 'Minify',
      disabled: false,
      type: 'default',
      icon: <Compress />,
      onClick: handleMinifyClick,
    },
    {
      key: 'prettify',
      label: 'Prettify',
      disabled: false,
      type: 'default',
      icon: <DataObject />,
      onClick: handlePrettifyClick,
    },
    {
      key: 'autoprettify',
      label: 'Auto Prettify',
      disabled: false,
      type: 'checkbox',
      onClick: () => toggleAutoPrettifyOn(!isAutoPrettifyOn),
    },
  ]

  React.useEffect(() => {
    if (!isChanged) return
    isAutoPrettifyOn && handleEditorPrettify()
    setIsChanged(false)
  }, [isAutoPrettifyOn, isChanged])

  // Helper functions

  const handleEditorPrettify = () => {
    if (!editorRef.current) return
    const action = editorRef.current.getAction('editor.action.formatDocument')
    action?.run()
  }

  const prettifyJsonString = (jsonString: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null, '\t')
    } catch (err) {
      return jsonString
    }
  }

  const minifyJsonString = (jsonString: string): string => {
    try {
      return JSON.stringify(JSON.parse(jsonString), null)
    } catch (err) {
      return jsonString
    }
  }

  // Actions

  const handleEditorDidMount: OnMount = (editor) => {
    editorRef.current = editor
  }

  function handleFixClick() {
    if (!editorRef.current) return
    const editor = editorRef.current
    const value = editor.getValue()
    const fixedValue = value && dirtyJson.parse(value)
    const formattedValue = fixedValue && prettifyJsonString(JSON.stringify(fixedValue))
    editor && editor.setValue(formattedValue)
  }

  function handlePrettifyClick() {
    if (!editorRef.current) return
    const action = editorRef.current.getAction('editor.action.formatDocument')
    action?.run()
  }

  function handleMinifyClick() {
    if (!editorRef.current) return
    const editor = editorRef.current
    const value = editor.getValue()
    if (!value) return
    const minifiedValue = minifyJsonString(value)
    editor.setValue(minifiedValue)
  }

  return (
    <Box sx={{ height }}>
      <MenuBar items={menuBarItems} />
      <Editor
        language="json"
        value={props.value}
        options={{
          automaticLayout: true,
          autoClosingBrackets: 'always',
          autoClosingQuotes: 'always',
          formatOnPaste: true,
          formatOnType: true,
          scrollBeyondLastLine: false,
        }}
        onChange={(value) => {
          setIsChanged(true)
          props.onChange(value)
        }}
        onMount={handleEditorDidMount}
      />
    </Box>
  )
}
