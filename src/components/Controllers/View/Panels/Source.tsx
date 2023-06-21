import * as React from 'react'
import SourcePanel from '../../../Parts/Panels/Source'
import { useStore } from '../store'

export default function Source() {
  const modified = useStore((state) => state.modified)
  const updateState = useStore((state) => state.updateState)
  return (
    <SourcePanel
      json
      value={modified}
      onChange={(value) => updateState({ modified: value })}
    />
  )
}
