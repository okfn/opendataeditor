import * as React from 'react'
import Box from '@mui/material/Box'
import ExportIcon from '@mui/icons-material/IosShare'
import SourceIcon from '@mui/icons-material/Code'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

export default function Actions() {
  // TODO: move styling to Layout?
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px', paddingX: 2 }}>
      <Columns spacing={2}>
        <Source />
        <Export />
      </Columns>
    </Box>
  )
}

function Source() {
  const isSource = useStore((state) => state.isSource)
  const toggleSource = useStore((state) => state.toggleSource)
  return (
    <DefaultButton
      label="Source"
      variant={isSource ? 'contained' : 'outlined'}
      icon={<SourceIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={toggleSource}
    />
  )
}

function Export() {
  return (
    <DefaultButton icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />} label="Export" />
  )
}
