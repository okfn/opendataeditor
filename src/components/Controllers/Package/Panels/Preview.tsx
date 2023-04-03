import * as React from 'react'
import Preview from '../../../Parts/Preview'
import { useStore } from '../store'

export default function PreviewPanel() {
  const revision = useStore((state) => state.revision)
  const modified = useStore((state) => state.modified)
  if (!modified) return null
  return <Preview format="json" descriptor={modified || {}} revision={revision} />
}
