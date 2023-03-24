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
        <Preview />
        <Columns spacing={2}>
          <Discard />
          <Save />
        </Columns>
      </Columns>
    </Box>
  )
}

function Preview() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <DefaultButton
      label="Preview"
      color={panel === 'preview' ? 'warning' : 'info'}
      icon={<SourceIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => updateState({ panel: panel !== 'preview' ? 'preview' : undefined })}
    />
  )
}

function Discard() {
  const revision = useStore((state) => state.revision)
  const revert = useStore((state) => state.revert)
  return (
    <RevertButton
      disabled={!revision}
      icon={<ChangesIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => revert()}
    />
  )
}

function Save() {
  const revision = useStore((state) => state.revision)
  return (
    <CommitButton
      disabled={!revision}
      icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />}
    />
  )
}
