import * as React from 'react'
import Editor from '@monaco-editor/react'
import { useStore, selectors } from '../store'

export default function Text() {
  const content = useStore((state) => state.content)
  const editor = useStore((state) => state.editor)
  const language = useStore(selectors.language)
  const onChange = useStore((state) => state.onChange)
  if (!content) return null
  return (
    <Editor
      value={content.modified}
      language={language}
      options={{
        automaticLayout: true,
        autoClosingBrackets: 'always',
        autoClosingQuotes: 'always',
        formatOnPaste: true,
        formatOnType: true,
        scrollBeyondLastLine: false,
      }}
      onChange={(text) => onChange && onChange(text)}
      onMount={(ref) => {
        // @ts-ignore
        editor.current = ref
      }}
    />
  )
}
