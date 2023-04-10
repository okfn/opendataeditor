import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <MenuBar
      items={['metadata', 'source', 'report']}
      colors={{
        metadata: panel === 'metadata' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
      }}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onSource={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
    />
  )
}
