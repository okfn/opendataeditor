import * as React from 'react'
import MenuBar, { MenuBarItem } from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  const items: MenuBarItem[] = ['metadata', 'report', 'source', 'editor']
  return (
    <MenuBar
      items={items}
      colors={{
        metadata: panel === 'metadata' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
        editor: panel === 'editor' ? 'warning' : undefined,
      }}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      onSource={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      onEditor={() => updateState({ panel: panel !== 'editor' ? 'editor' : undefined })}
    />
  )
}
