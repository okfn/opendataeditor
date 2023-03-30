import * as React from 'react'
import isEmpty from 'lodash/isEmpty'
import Box from '@mui/material/Box'
import MetadataIcon from '@mui/icons-material/Tune'
import ChangesIcon from '@mui/icons-material/History'
import ExportIcon from '@mui/icons-material/IosShare'
import SaveIcon from '@mui/icons-material/Check'
import DefaultButton from '../../Parts/Buttons/DefaultButton'
import CommitButton from '../../Parts/Buttons/CommitButton'
import Columns from '../../Parts/Columns'
import { useStore } from './store'

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
        <Export />
        <Metadata />
        <Changes />
        <Save />
      </Columns>
    </Box>
  )
}

function Export() {
  const setDialog = useStore((state) => state.setDialog)
  return (
    <DefaultButton
      icon={<ExportIcon fontSize="small" sx={{ mr: 1 }} />}
      label="Export"
      onClick={() => setDialog('export/table')}
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

function Changes() {
  const panel = useStore((state) => state.panel)
  const setPanel = useStore((state) => state.setPanel)
  const tablePatch = useStore((state) => state.tablePatch)
  return (
    <DefaultButton
      label="Revert"
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
