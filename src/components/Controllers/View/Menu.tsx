import * as React from 'react'
import * as menu from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <menu.MenuBar>
      <menu.EditorButton
        color={panel === 'editor' ? 'warning' : undefined}
        onClick={() => updateState({ panel: panel !== 'editor' ? 'editor' : undefined })}
      />
      <menu.MetadataButton
        color={panel === 'metadata' ? 'warning' : undefined}
        onClick={() =>
          updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
        }
      />
      <menu.ReportButton
        color={panel === 'report' ? 'warning' : undefined}
        onClick={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      />
      <menu.SourceButton
        color={panel === 'source' ? 'warning' : undefined}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
    </menu.MenuBar>
  )
}
