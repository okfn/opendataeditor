import * as React from 'react'
import MenuBar, { MenuBarItem } from '../../Parts/Bars/Menu'
import { useStore, selectors } from './store'

// TODO: find a way to figure out that undo/redo is available in editor

export default function Menu() {
  const language = useStore(selectors.language)
  const panel = useStore((state) => state.panel)
  const clear = useStore((state) => state.clear)
  const undo = useStore((state) => state.undo)
  const redo = useStore((state) => state.redo)
  const fix = useStore((state) => state.fix)
  const minify = useStore((state) => state.minify)
  const prettify = useStore((state) => state.prettify)
  const updateState = useStore((state) => state.updateState)
  const minimalVersion = useStore((state) => state.minimalVersion)
  const currentVersion = useStore((state) => state.currentVersion)
  const maximalVersion = useStore((state) => state.maximalVersion)
  const items: MenuBarItem[] = [
    'editor',
    'metadata',
    'report',
    'source',
    'clear',
    'undo',
    'redo',
  ]
  if (language === 'json') items.push('fix', 'minify', 'prettify')
  return (
    <MenuBar
      items={items}
      colors={{
        editor: 'info',
        metadata: panel === 'metadata' ? 'warning' : undefined,
        report: panel === 'report' ? 'warning' : undefined,
        source: 'info',
      }}
      onMetadata={() =>
        updateState({ panel: panel !== 'metadata' ? 'metadata' : undefined })
      }
      onReport={() => updateState({ panel: panel !== 'report' ? 'report' : undefined })}
      onClear={clear}
      onUndo={currentVersion > minimalVersion ? undo : undefined}
      onRedo={currentVersion < maximalVersion ? redo : undefined}
      onFix={fix}
      onMinify={minify}
      onPrettify={prettify}
    />
  )
}
