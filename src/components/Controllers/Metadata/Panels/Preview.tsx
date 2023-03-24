import * as React from 'react'
import Preview from '../../../Parts/Preview'
import { useStore } from '../store'

export default function PreviewPanel() {
  const revision = useStore((state) => state.revision)
  const descriptor = useStore((state) => state.descriptor)
  if (!descriptor) return null
  return <Preview format="json" descriptor={descriptor || {}} revision={revision} />
}
