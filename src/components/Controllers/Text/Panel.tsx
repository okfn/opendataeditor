import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../Parts/ScrollBox'
import MetadataPanel from './Panels/Metadata'
import ReportPanel from './Panels/Report'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const panel = useStore((state) => state.panel)
  return (
    <ScrollBox
      hidden={!panel}
      height={theme.spacing(48)}
      sx={{ borderTop: 'solid 1px #ddd' }}
    >
      {panel === 'metadata' && <MetadataPanel />}
      {panel === 'report' && <ReportPanel />}
    </ScrollBox>
  )
}
