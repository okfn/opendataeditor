import * as React from 'react'
import Box from '@mui/material/Box'
import { useStore } from './store'
import { Grid } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ExportButton from '../../Parts/Buttons/ExportButton'

export default function Actions() {
  const theme = useTheme()
  const height = `calc(${theme.spacing(8)} - 1px)`
  const isPreview = useStore((state) => state.isPreview)
  const exportFormat = useStore((state) => state.exportFormat)
  const setExportFormat = useStore((state) => state.setExportFormat)
  const togglePreview = useStore((state) => state.togglePreview)
  const exporter = useStore((state) => state.exporter)
  return (
    <Box sx={{ lineHeight: height, borderTop: 1, borderColor: 'divider', paddingX: 2 }}>
      <Grid item xs={4}>
        <ExportButton
          format={exportFormat}
          options={['csv', 'xlsx']}
          isPreview={isPreview}
          onExport={exporter}
          onPreview={togglePreview}
          setFormat={setExportFormat}
        />
      </Grid>
    </Box>
  )
}
