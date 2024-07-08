import * as menu from '../../Parts/Bars/Menu'
import * as helpers from '../../../helpers'
import * as settings from '../../../settings'
import * as store from '@client/store'

export default function Menu() {
  const mode = store.useStore((state) => state.table?.mode)
  const panel = store.useStore((state) => state.panel)
  const report = store.useStore((state) => state.report)
  const measure = store.useStore((state) => state.measure)
  const history = store.useStore((state) => state.table?.history)
  const format = store.useStore((state) => state.record?.resource.format)
  const undoneHistory = store.useStore((state) => state.table?.undoneHistory)

  return (
    <menu.MenuBar>
      <menu.MetadataButton
        active={panel === 'metadata'}
        onClick={() => store.togglePanel('metadata')}
      />
      <menu.ReportButton
        disabled={!report || report?.valid}
        active={panel === 'report'}
        onClick={() => store.togglePanel('report')}
      />
      <menu.SourceButton
        disabled={!helpers.getLanguageByFormat(format)}
        active={panel === 'source'}
        onClick={() => store.togglePanel('source')}
      />
      <menu.ChatButton
        disabled={!settings.TEXT_TABLE_FORMATS.includes(format || '')}
        onClick={() => store.toggleDialog('chat')}
      />
      <menu.ErrorsButton
        active={mode === 'errors'}
        onClick={store.toggleTableErrorMode}
        disabled={!measure?.errors}
      />
      <menu.UndoButton
        onClick={store.undoTableChange}
        disabled={!history?.changes.length}
      />
      <menu.RedoButton
        onClick={store.redoTableChange}
        disabled={!undoneHistory?.changes.length}
      />
    </menu.MenuBar>
  )
}
