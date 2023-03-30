import * as React from 'react'
import { DiffEditor } from '@monaco-editor/react'
import { useStore, selectors } from '../store'

export default function Text() {
  const content = useStore((state) => state.content)
  const language = useStore(selectors.language)
  if (!content) return null
  return (
    <DiffEditor
      original={content.original}
      modified={content.modified}
      language={language}
      options={{
        renderSideBySide: false,
        automaticLayout: true,
        readOnly: true,
      }}
    />
  )
}
