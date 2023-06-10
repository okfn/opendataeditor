import * as React from 'react'
import { useStore } from './store'
import * as menu from '../../Parts/Bars/Menu'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const measure = useStore((state) => state.measure)
  const history = useStore((state) => state.history)
  const undoneHistory = useStore((state) => state.undoneHistory)
  const updateState = useStore((state) => state.updateState)
  const toggleErrorMode = useStore((state) => state.toggleErrorMode)
  const undoChange = useStore((state) => state.undoChange)
  const redoChange = useStore((state) => state.redoChange)
  return (
    <menu.MenuBar>
      <menu.EditorButton color="info" />
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
      <menu.ErrorsButton onClick={toggleErrorMode} disabled={!measure?.errors} />
      <menu.UndoButton onClick={undoChange} disabled={!history?.changes.length} />
      <menu.RedoButton onClick={redoChange} disabled={!undoneHistory?.changes.length} />
    </menu.MenuBar>
  )
}
