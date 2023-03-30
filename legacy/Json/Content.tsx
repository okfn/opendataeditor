import * as React from 'react'
import TextEditor from '../../Editors/Text'
import { useStore } from './store'

export default function Content() {
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!modified) return null
  return (
    <TextEditor
      text={modified}
      format="json"
      onChange={(text) => updateState({ modified: text })}
    />
  )
}
