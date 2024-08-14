import * as menu from '../../Parts/Bars/Menu'
import * as store from '@client/store'

export default function Menu() {
  const panel = store.useStore((state) => state.panel)
  const report = store.useStore((state) => state.report)
  const source = store.useStore((state) => state.source)

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
        disabled={!source?.text}
        onClick={() => store.togglePanel('report')}
      />
    </menu.MenuBar>
  )
}
