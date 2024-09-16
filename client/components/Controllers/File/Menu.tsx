import * as menu from '../../Parts/Bars/Menu'
import * as store from '@client/store'
import * as action from '../../Parts/Bars/Action'
import Box from '@mui/material/Box'

export default function Menu() {
  const panel = store.useStore((state) => state.panel)
  const report = store.useStore((state) => state.report)
  const source = store.useStore((state) => state.source)

  return (
    <menu.MenuBar fullWidth>
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
            color="OKFNCoolGray"
          />
          <menu.ReportButton
            disabled={!report || report?.valid}
            active={panel === 'report'}
            onClick={() => store.togglePanel('report')}
            color="OKFNCoolGray"
          />
          <menu.SourceButton
            disabled={!source?.text}
            onClick={() => store.togglePanel('report')}
            color="OKFNCoolGray"
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
          <action.PublishButton disabled />
          <action.SaveButton disabled />
        </Box>
      </Box>
    </menu.MenuBar>
  )
}
