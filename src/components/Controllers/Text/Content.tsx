import * as React from 'react'
import TextEditor from '../../Editors/Text'
import { useStore } from './store'

export default function Content() {
  const file = useStore((state) => state.file)
  const content = useStore((state) => state.content)
  const updateState = useStore((state) => state.updateState)
  if (!content) return null
  return (
    <TextEditor
      value={content}
      language={file.record?.resource.format === 'md' ? 'markdown' : 'plaintext'}
      onChange={(value) => updateState({ content: value })}
    />
  )
}
