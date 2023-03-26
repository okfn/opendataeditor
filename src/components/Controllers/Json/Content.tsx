import * as React from 'react'
import JsonEditor from '../../Editors/Json/Json'
import { useStore } from './store'

export default function Content() {
  const content = useStore((state) => state.content)
  const updateState = useStore((state) => state.updateState)
  if (!content) return null
  return (
    <JsonEditor value={content} onChange={(value) => updateState({ content: value })} />
  )
}
