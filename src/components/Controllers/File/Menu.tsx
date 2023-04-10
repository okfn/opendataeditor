import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <MenuBar
      items={['metadata', 'report', 'source']}
      colors={{
        metadata: panel === 'metadata' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
      }}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      onSource={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
    />
  )
}
