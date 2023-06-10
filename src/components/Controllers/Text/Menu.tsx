import * as React from 'react'
import { useStore, selectors } from './store'
import * as menu from '../../Parts/Bars/Menu'

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
      <menu.SourceButton color="info" />
      <menu.ClearButton onClick={clear} />
      <menu.UndoButton onClick={currentVersion > minimalVersion ? undo : undefined} />
      <menu.RedoButton onClick={currentVersion < maximalVersion ? redo : undefined} />
      {language === 'json' && (
        <React.Fragment>
          <menu.FixButton onClick={fix} />
          <menu.MinifyButton onClick={minify} />
          <menu.PrettifyButton onClick={prettify} />
        </React.Fragment>
      )}
    </menu.MenuBar>
  )
}
