import * as React from 'react'
import TextEditor from '../../../Editors/Text'
import { useStore } from '../store'

export default function MetadataPanel() {
  const file = useStore((state) => state.file)
  const content = useStore((state) => state.content)
  if (!content) return null
  return <TextEditor diff content={content} format={file.record?.resource.format} />
}
