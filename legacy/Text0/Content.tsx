import * as React from 'react'
import TextEditor from '../../Editors/Text'
import { useStore } from './store'

export default function Content() {
  const file = useStore((state) => state.file)
  const content = useStore((state) => state.content)
  const updateContent = useStore((state) => state.updateContent)
  if (!content) return null
  return (
    <TextEditor
      content={content}
      format={file.record?.resource.format}
      onChange={(text) => updateContent(text)}
    />
  )
}
