import * as React from 'react'
import MenuBar, { MenuBarItem } from '../../Parts/Bars/Menu'
import { useStore, selectors } from './store'

export default function Menu() {
  const language = useStore(selectors.language)
  const panel = useStore((state) => state.panel)
  const clear = useStore((state) => state.clear)
  const fix = useStore((state) => state.fix)
  const minify = useStore((state) => state.minify)
  const prettify = useStore((state) => state.prettify)
  const updateState = useStore((state) => state.updateState)
  const items: MenuBarItem[] = ['editor', 'metadata', 'report', 'source', 'clear']
  if (language === 'json') items.push('fix', 'minify', 'prettify')
  return (
    <MenuBar
      items={items}
      colors={{
        editor: 'info',
        metadata: panel === 'metadata' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
        source: panel === 'source' ? 'warning' : undefined,
      }}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      onClear={clear}
      onFix={fix}
      onMinify={minify}
      onPrettify={prettify}
    />
  )
}
