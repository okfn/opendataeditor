import * as React from 'react'
import { useStore } from './store'
import * as menu from '../../Parts/Bars/Menu'

export default function Menu() {
  const panel = useStore((state) => state.panel)
  const report = useStore((state) => state.report)
  const measure = useStore((state) => state.measure)
  const history = useStore((state) => state.history)
  const undoneHistory = useStore((state) => state.undoneHistory)
  const updateState = useStore((state) => state.updateState)
  const toggleErrorMode = useStore((state) => state.toggleErrorMode)
  const undoChange = useStore((state) => state.undoChange)
  const redoChange = useStore((state) => state.redoChange)
  return (
    <menu.MenuBar>
      <menu.EditorButton enabled />
      <menu.MetadataButton
        active={panel === 'metadata'}
        onClick={() =>
          updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
        }
      />
      <menu.ReportButton
        disabled={!report || report?.valid}
        active={panel === 'report'}
        onClick={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      />
      <menu.SourceButton
        active={panel === 'source'}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
      <menu.ChatButton disabled />
      <menu.ErrorsButton onClick={toggleErrorMode} disabled={!measure?.errors} />
      <menu.UndoButton onClick={undoChange} disabled={!history?.changes.length} />
      <menu.RedoButton onClick={redoChange} disabled={!undoneHistory?.changes.length} />
    </menu.MenuBar>
  )
}
