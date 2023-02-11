import * as React from 'react'
import isEmpty from 'lodash/isEmpty'
import Box from '@mui/material/Box'
import MetadataIcon from '@mui/icons-material/Tune'
import ErrorIcon from '@mui/icons-material/WarningAmber'
import ChangesIcon from '@mui/icons-material/History'
import ExportIcon from '@mui/icons-material/IosShare'
import SourceIcon from '@mui/icons-material/Code'
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
        <Export />
        <Source />
        <Metadata />
        <Errors />
        <Changes />
        <Save />
      </Columns>
    </Box>
  )
}

function Export() {
  return (
    <DefaultButton icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />} label="Export" />
  )
}

function Source() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  return (
    <DefaultButton
      label="Source"
      icon={<SourceIcon fontSize="small" sx={{ mr: 1 }} />}
      variant={panel === 'source' ? 'contained' : 'outlined'}
      onClick={() => setPanel(panel !== 'source' ? 'source' : undefined)}
    />
  )
}

function Metadata() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  return (
    <DefaultButton
      label="Metadata"
      icon={<MetadataIcon fontSize="small" sx={{ mr: 1 }} />}
      variant={panel === 'metadata' ? 'contained' : 'outlined'}
      onClick={() => setPanel(panel !== 'metadata' ? 'metadata' : undefined)}
    />
  )
}

function Errors() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  return (
    <DefaultButton
      label="Errors"
      icon={<ErrorIcon fontSize="small" sx={{ mr: 1 }} />}
      variant={panel === 'errors' ? 'contained' : 'outlined'}
      onClick={() => setPanel(panel !== 'errors' ? 'errors' : undefined)}
    />
  )
}

function Changes() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  const tablePatch = useStore((state) => state.tablePatch)
  return (
    <DefaultButton
      label="Changes"
      disabled={isEmpty(tablePatch)}
      color={!isEmpty(tablePatch) ? 'warning' : undefined}
      icon={<ChangesIcon fontSize="small" sx={{ mr: 1 }} />}
      variant={panel === 'changes' ? 'contained' : 'outlined'}
      onClick={() => setPanel(panel !== 'changes' ? 'changes' : undefined)}
    />
  )
}

function Save() {
  const commitPatch = useStore((state) => state.commitPatch)
  const tablePatch = useStore((state) => state.tablePatch)
  return (
    <CommitButton
      disabled={isEmpty(tablePatch)}
      icon={<SaveIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={commitPatch}
    />
  )
}
