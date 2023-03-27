import * as React from 'react'
import Box from '@mui/material/Box'
import SaveIcon from '@mui/icons-material/Check'
import SourceIcon from '@mui/icons-material/Code'
import ChangesIcon from '@mui/icons-material/History'
import ExportIcon from '@mui/icons-material/IosShare'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import RevertButton from '../../Parts/Buttons/RevertButton'
import Columns from '../../Parts/Columns'
import { useStore, selectors } from './store'

export default function Actions() {
  // TODO: instead of 63px use proper calculation: theme.spacing(8) - 1px
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: '63px', paddingX: 2 }}>
      <Columns spacing={2}>
        <SaveAs />
        <Preview />
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

function Revert() {
  const isUpdated = useStore(selectors.isUpdated)
  const revertDescriptor = useStore((state) => state.revertDescriptor)
  return (
    <RevertButton
      disabled={!isUpdated}
      icon={<ChangesIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => revertDescriptor()}
    />
  )
}

function Save() {
  const isUpdated = useStore(selectors.isUpdated)
  const saveDescriptor = useStore((state) => state.saveDescriptor)
  return (
    <CommitButton
      disabled={!isUpdated}
      icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => saveDescriptor()}
    />
  )
}
