import * as store from '@client/store'
import * as menu from '../../Parts/Bars/Menu'
import * as action from '../../Parts/Bars/Action'
import Box from '@mui/material/Box'

export default function Menu() {
  const report = store.useStore((state) => state.report)
  const panel = store.useStore((state) => state.panel)
  const minimalVersion = store.useStore((state) => state.text?.minimalVersion)
  const currentVersion = store.useStore((state) => state.text?.currentVersion)
  const maximalVersion = store.useStore((state) => state.text?.maximalVersion)
  if (!minimalVersion || !currentVersion || !maximalVersion) return null

  const isUpdated = store.useStore(store.getIsTextOrResourceUpdated)

  return (
    <menu.MenuBar>
      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <menu.MetadataButton
            active={panel === 'metadata'}
            onClick={() => store.togglePanel('metadata')}
          />
          <menu.ReportButton
            disabled={!report || report?.valid}
            active={panel === 'report'}
            onClick={() => store.togglePanel('report')}
          />
          <menu.SourceButton disabled />
          <menu.UndoButton
            onClick={store.undoText}
            disabled={currentVersion <= minimalVersion}
          />
          <menu.RedoButton
            onClick={store.redoText}
            disabled={currentVersion >= maximalVersion}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <action.PublishButton disabled />
          <action.SaveButton updated={isUpdated} onClick={store.saveText} />
        </Box>
      </Box>
    </menu.MenuBar>
  )
}
