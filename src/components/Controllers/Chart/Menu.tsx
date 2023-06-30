import * as React from 'react'
import * as menu from '../../Parts/Bars/Menu'
import { DEFAULT_PANEL } from './settings'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <menu.MenuBar>
      <menu.EditorButton enabled />
      <menu.MetadataButton
        active={panel === 'metadata'}
        onClick={() =>
          updateState({ panel: panel !== 'metadata' ? 'metadata' : DEFAULT_PANEL })
        }
      />
      <menu.ReportButton
        active={panel === 'report'}
        onClick={() =>
          updateState({ panel: panel !== 'report' ? 'report' : DEFAULT_PANEL })
        }
      />
      <menu.SourceButton
        active={panel === 'source'}
        onClick={() =>
          updateState({ panel: panel !== 'source' ? 'source' : DEFAULT_PANEL })
        }
      />
    </menu.MenuBar>
  )
}
