import * as React from 'react'
import TextEditor from '../../Editors/Text'
import { useStore } from './store'

export default function Content() {
  const content = useStore((state) => state.content)
  const updateState = useStore((state) => state.updateState)
  if (!content) return null
  return (
    <TextEditor
      text={content}
      format="json"
      onChange={(text) => updateState({ content: text })}
    />
  )
}
