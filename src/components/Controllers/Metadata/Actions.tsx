import * as React from 'react'
import Box from '@mui/material/Box'
import SaveIcon from '@mui/icons-material/Check'
import MetadataIcon from '@mui/icons-material/Tune'
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
    <Box
      sx={{
        borderTop: 'solid 1px #ddd',
        lineHeight: '63px',
        paddingX: 2,
        backgroundColor: '#fafafa',
      }}
    >
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
  return (
    <DefaultButton
      label="Metadata"
      icon={<MetadataIcon fontSize="small" sx={{ mr: 1 }} />}
      disabled={true}
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
