import * as React from 'react'
import JsonEditor from '../../Editors/Json/Json'
import { useStore } from './store'

export default function Content() {
  const checkpoint = useStore((state) => state.checkpoint)
  const updateState = useStore((state) => state.updateState)
  if (!checkpoint) return null
  return (
    <JsonEditor
      value={checkpoint}
      onChange={(value) => updateState({ content: value })}
    />
  )
}
