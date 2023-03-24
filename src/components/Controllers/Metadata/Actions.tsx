import * as React from 'react'
import Box from '@mui/material/Box'
import SaveIcon from '@mui/icons-material/Check'
import SourceIcon from '@mui/icons-material/Code'
import ChangesIcon from '@mui/icons-material/History'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import RevertButton from '../../Parts/Buttons/RevertButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

export default function Actions() {
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px', paddingX: 2 }}>
      <Columns spacing={2}>
        <Source />
        <Columns spacing={2}>
          <Discard />
          <Save />
        </Columns>
      </Columns>
    </Box>
  )
}

function Source() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <DefaultButton
      label="Source"
      color={panel === 'source' ? 'warning' : 'info'}
      icon={<SourceIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => updateState({ panel: panel !== 'source' ? 'source' : undefined })}
    />
  )
}

function Discard() {
  return (
    <RevertButton
      disabled={true}
      icon={<ChangesIcon fontSize="small" sx={{ mr: 1 }} />}
    />
  )
}

function Save() {
  return (
    <CommitButton disabled={true} icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />} />
  )
}
