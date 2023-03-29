import * as React from 'react'
import Box from '@mui/material/Box'
import ExportIcon from '@mui/icons-material/IosShare'
import MetadataIcon from '@mui/icons-material/Tune'
import SaveIcon from '@mui/icons-material/Check'
import ChangesIcon from '@mui/icons-material/History'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import RevertButton from '../../Parts/Buttons/RevertButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import Columns from '../../Parts/Columns'
import { useStore, selectors } from './store'

export default function Actions() {
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px', paddingX: 2 }}>
      <Columns spacing={2}>
        <SaveAs />
        <Metadata />
        <Revert />
        <Save />
      </Columns>
    </Box>
  )
}

function SaveAs() {
  const updateState = useStore((state) => state.updateState)
  return (
    <DefaultButton
      label="Save as"
      icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => updateState({ dialog: 'saveAs' })}
    />
  )
}

function Metadata() {
  const panel = useStore((state) => state.panel)
  const updateState = useStore((state) => state.updateState)
  return (
    <DefaultButton
      label="Metadata"
      icon={<MetadataIcon fontSize="small" sx={{ mr: 1 }} />}
      color={panel === 'metadata' ? 'warning' : 'info'}
      onClick={() => updateState({ panel: 'metadata' })}
    />
  )
}

function Revert() {
  const isUpdated = useStore(selectors.isUpdated)
  const revert = useStore((state) => state.revert)
  return (
    <RevertButton
      disabled={!isUpdated}
      icon={<ChangesIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => revert()}
    />
  )
}

function Save() {
  const isUpdated = useStore(selectors.isUpdated)
  const save = useStore((state) => state.save)
  return (
    <CommitButton
      disabled={!isUpdated}
      icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => save()}
    />
  )
}
