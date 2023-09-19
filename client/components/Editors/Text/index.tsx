import './resize'
import Editor, { EditorProps } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'

export type ITextEditor = editor.IStandaloneCodeEditor
export interface TextEditorProps extends EditorProps {}

export default function TextEditor(props: TextEditorProps) {
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
        wordWrap: 'on',
        ...options,
      }}
      {...others}
    />
  )
}
