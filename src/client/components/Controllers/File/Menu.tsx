import * as React from 'react'
import * as menu from '../../Parts/Bars/Menu'
import { useStore } from './store'

export default function Menu() {
  const type = useStore((state) => state.record?.type)
  const panel = useStore((state) => state.panel)
  const dialog = useStore((state) => state.dialog)
  const report = useStore((state) => state.report)
  const textSource = useStore((state) => state.textSource)
  const updateState = useStore((state) => state.updateState)
  return (
    <menu.MenuBar>
      <menu.EditorButton disabled />
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
        disabled={!textSource}
        active={panel === 'source'}
        onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
      />
      <menu.ChatButton
        disabled={type !== 'map'}
        onClick={() => updateState({ dialog: dialog !== 'chat' ? 'chat' : undefined })}
      />
    </menu.MenuBar>
  )
}
