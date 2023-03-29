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
      text={content}
      format={file.record?.resource.format}
      onChange={(value) => updateState({ content: value })}
    />
  )
}
