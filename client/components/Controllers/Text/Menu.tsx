import * as React from 'react'
import { useStore, selectors } from './store'
import * as menu from '../../Parts/Bars/Menu'

export default function Menu() {
  const report = useStore((state) => state.report)
  const language = useStore(selectors.language)
  const type = useStore((state) => state.record?.type)
  const panel = useStore((state) => state.panel)
  const dialog = useStore((state) => state.dialog)
  const execute = useStore((state) => state.execute)
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
      <menu.SourceButton enabled />
      <menu.ChatButton
        onClick={() => updateState({ dialog: dialog !== 'chat' ? 'chat' : undefined })}
      />
      {type === 'script' && <menu.RunButton onClick={execute} />}
      <menu.UndoButton onClick={undo} disabled={currentVersion <= minimalVersion} />
      <menu.RedoButton onClick={redo} disabled={currentVersion >= maximalVersion} />
      <menu.ClearButton onClick={clear} />
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
