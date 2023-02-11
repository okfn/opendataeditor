import * as React from 'react'
import Box from '@mui/material/Box'
import DrawIcon from '@mui/icons-material/Insights'
import ExportIcon from '@mui/icons-material/IosShare'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

export default function Actions() {
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px', paddingX: 2 }}>
      <Columns spacing={2}>
        <Query />
        <Export />
      </Columns>
    </Box>
  )
}

function Query() {
  const drawChart = useStore((state) => state.drawChart)
  return (
    <DefaultButton
      icon={<DrawIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Draw"
      onClick={drawChart}
    />
  )
}

function Export() {
  return (
    <DefaultButton icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />} label="Export" />
  )
}
