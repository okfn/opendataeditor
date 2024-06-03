import { useStore } from './store'
import * as menu from '../../Parts/Bars/Menu'
import * as helpers from '../../../helpers'
import * as settings from '../../../settings'

export default function Menu() {
  const mode = useStore((state) => state.mode)
  const panel = useStore((state) => state.panel)
  const dialog = useStore((state) => state.dialog)
  const report = useStore((state) => state.report)
  const measure = useStore((state) => state.measure)
  const history = useStore((state) => state.history)
  const format = useStore((state) => state.record?.resource.format)
  const undoneHistory = useStore((state) => state.undoneHistory)
  const updateState = useStore((state) => state.updateState)
  const toggleErrorMode = useStore((state) => state.toggleErrorMode)
  const undoChange = useStore((state) => state.undoChange)
  const redoChange = useStore((state) => state.redoChange)
  return (
    <menu.MenuBar>
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
        disabled={!helpers.getLanguageByFormat(format)}
        active={panel === 'source'}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
      <menu.ChatButton
        disabled={!settings.TEXT_TABLE_FORMATS.includes(format || '')}
        onClick={() => updateState({ dialog: dialog !== 'chat' ? 'chat' : undefined })}
      />
      <menu.ErrorsButton
        active={mode === 'errors'}
        onClick={toggleErrorMode}
        disabled={!measure?.errors}
      />
      <menu.UndoButton onClick={undoChange} disabled={!history?.changes.length} />
      <menu.RedoButton onClick={redoChange} disabled={!undoneHistory?.changes.length} />
    </menu.MenuBar>
  )
}
