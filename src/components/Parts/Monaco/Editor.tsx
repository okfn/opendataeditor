import * as React from 'react'
import Editor, { EditorProps } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'

export type IMonacoEditor = editor.IStandaloneCodeEditor
export interface MonacoEditorProps extends EditorProps {}

export default function MonacoEditor(props: MonacoEditorProps) {
  const { options, ...others } = props
  return (
    <Editor
      options={{
        automaticLayout: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
        ...options,
      }}
      {...others}
    />
  )
}
