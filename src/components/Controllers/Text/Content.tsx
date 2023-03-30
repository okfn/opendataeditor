import * as React from 'react'
import TextEditor from '../../Editors/Text'
import { useStore } from './store'

export default function Content() {
  const file = useStore((state) => state.file)
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  if (!modified) return null
  return (
    <TextEditor
      text={modified}
      format={file.record?.resource.format}
      onChange={(value) => updateState({ modified: value })}
    />
  )
}
