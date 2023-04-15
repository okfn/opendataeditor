import * as React from 'react'
import ScrollBox from '../../Parts/ScrollBox'
import ReportPanel from './Panels/Report'
import SourcePanel from './Panels/Source'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

export default function Content() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  return (
    <ScrollBox
      hidden={!panel}
      height={theme.spacing(48)}
      sx={{ borderTop: 'solid 1px #ddd' }}
    >
      {panel === 'report' && <ReportPanel />}
      {panel === 'source' && <SourcePanel />}
    </ScrollBox>
  )
}
