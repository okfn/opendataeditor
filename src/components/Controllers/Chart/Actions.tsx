import * as React from 'react'
import Box from '@mui/material/Box'
import DrawIcon from '@mui/icons-material/Insights'
import ExportIcon from '@mui/icons-material/IosShare'
import SaveIcon from '@mui/icons-material/Check'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

export default function Actions() {
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px', paddingX: 2 }}>
      <Columns spacing={2}>
        <Query />
        <Columns spacing={2}>
          <Export />
          <Save />
        </Columns>
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
    <DefaultButton
      disabled={true}
      icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Export"
    />
  )
}

function Save() {
  return (
    <CommitButton disabled={true} icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />} />
  )
}
