import * as menu from '../../Parts/Bars/Menu'
import * as store from '@client/store'

export default function Menu() {
  const panel = store.useStore((state) => state.panel)
  const report = store.useStore((state) => state.report)
  const history = store.useStore((state) => state.table?.history)
  const source = store.useStore((state) => state.source)
  const undoneHistory = store.useStore((state) => state.table?.undoneHistory)

  return (
    <menu.MenuBar>
      <menu.MetadataButton
        active={panel === 'metadata'}
        onClick={() => store.togglePanel('metadata')}
        color='OKFNCoolGray'
      />
      <menu.ReportButton
        disabled={!report || report?.valid}
        active={panel === 'report'}
        onClick={() => store.togglePanel('report')}
        color='OKFNCoolGray'
      />
      <menu.SourceButton
        disabled={!source?.text}
        active={panel === 'source'}
        onClick={() => store.togglePanel('source')}
        color='OKFNCoolGray'
      />
      <menu.UndoButton
        onClick={store.undoTableChange}
        disabled={!history?.changes.length}
        color='OKFNCoolGray'
      />
      <menu.RedoButton
        onClick={store.redoTableChange}
        disabled={!undoneHistory?.changes.length}
        color='OKFNCoolGray'
      />
    </menu.MenuBar>
  )
}
