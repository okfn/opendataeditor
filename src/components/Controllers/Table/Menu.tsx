import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

// TODO: make non-alternative buttons in controllers' menus like editor/metadata
// disabled but colored and fix other things like do not provide empty callbacks
export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <MenuBar
      items={['editor', 'metadata', 'source', 'report']}
      colors={{
        editor: 'info',
        metadata: panel === 'metadata' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
      }}
      onEditor={() => {}}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onSource={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
    />
  )
}
