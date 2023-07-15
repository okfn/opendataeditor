import * as React from 'react'
import ScrollBox from '../../Parts/Boxes/Scroll'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import ChangesPanel from './Panels/Changes'
import SourcePanel from './Panels/Source'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Panel() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  return (
    <ScrollBox
      hidden={!panel}
      height={theme.spacing(42)}
      sx={{ borderTop: 'solid 1px #ddd' }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'report' && <ReportPanel />}
      {panel === 'changes' && <ChangesPanel />}
      {panel === 'source' && <SourcePanel />}
    </ScrollBox>
  )
}
