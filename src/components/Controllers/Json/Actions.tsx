import * as React from 'react'
import Box from '@mui/material/Box'
import ExportIcon from '@mui/icons-material/IosShare'
import SaveIcon from '@mui/icons-material/Check'
import ChangesIcon from '@mui/icons-material/History'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import RevertButton from '../../Parts/Buttons/RevertButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import Columns from '../../Parts/Columns'
import { useTheme } from '@mui/material/styles'
import { useStore, selectors } from './store'

export default function Actions() {
  const theme = useTheme()
  return (
    <Box sx={{ borderTop: 'solid 1px #ddd', lineHeight: theme.spacing(8), paddingX: 2 }}>
      <Columns spacing={2}>
        <SaveAs />
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

function Revert() {
  const isUpdated = useStore(selectors.isUpdated)
  const revertContent = useStore((state) => state.revertContent)
  return (
    <RevertButton
      disabled={!isUpdated}
      icon={<ChangesIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => revertContent()}
    />
  )
}

function Save() {
  const isUpdated = useStore(selectors.isUpdated)
  const saveContent = useStore((state) => state.saveContent)
  return (
    <CommitButton
      disabled={!isUpdated}
      icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => saveContent()}
    />
  )
}
