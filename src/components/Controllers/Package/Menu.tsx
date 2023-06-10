import * as React from 'react'
import * as menu from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const clear = useStore((state) => state.clear)
  const updateState = useStore((state) => state.updateState)
  return (
    <menu.MenuBar>
      <menu.EditorButton color="info" disabled={true} />
      <menu.MetadataButton color="info" disabled={true} />
      <menu.ReportButton
        color={panel === 'report' ? 'warning' : undefined}
        onClick={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      />
      <menu.SourceButton
        color={panel === 'source' ? 'warning' : undefined}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
      <menu.ClearButton onClick={clear} />
    </menu.MenuBar>
  )
}
