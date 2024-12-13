import Editor, { EditorProps } from '@monaco-editor/react'
import { editor } from 'monaco-editor/esm/vs/editor/editor.api'
import { useTranslation } from 'react-i18next'
import './resize'

export type ITextEditor = editor.IStandaloneCodeEditor
export interface TextEditorProps extends EditorProps {}

export default function TextEditor(props: TextEditorProps) {
  const { options, ...others } = props
  const { t } = useTranslation()

  return (
    <Editor
      loading={<div>{t('loading')}...</div>}
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
