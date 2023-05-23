import * as React from 'react'
import MenuBar from '../../Parts/Bars/Menu'
import { useStore } from './store'

// TODO: make non-alternative buttons in controllers' menus like editor/metadata
// disabled but colored and fix other things like do not provide empty callbacks
export default function Menu() {
  const record = useStore((state) => state.record)
  const mode = useStore((state) => state.mode)
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  const toggleErrorMode = useStore((state) => state.toggleErrorMode)
  return (
    <MenuBar
      items={['editor', 'metadata', 'source', 'report', 'errors']}
      colors={{
        editor: 'info',
        metadata: panel === 'metadata' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
        errors: mode === 'errors' ? 'warning' : undefined,
      }}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onSource={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      onErrors={record?.stats.errors ? () => toggleErrorMode() : undefined}
    />
  )
}
