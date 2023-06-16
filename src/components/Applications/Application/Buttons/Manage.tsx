import * as React from 'react'
import Box from '@mui/material/Box'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import ManageIcon from '@mui/icons-material/FileCopy'
import IconButton from '../../../Parts/Buttons/Icon'
import DropdownButton from '../../../Parts/Buttons/Dropdown'
import LightTooltip from '../../../Parts/Tooltips/Light'
import { useStore, selectors } from '../store'

export default function ManageButton() {
  const path = useStore((state) => state.path)
  let title = 'Manage selected'
  if (!path) title = 'Select something to manage'
  return (
    <LightTooltip title={title}>
      <Box>
        <DropdownButton
          label="Manage"
          variant="text"
          icon={<ManageIcon fontSize="small" sx={{ mr: 1 }} />}
          disabled={!path}
        >
          <CopyButton />
          <MoveButton />
        </DropdownButton>
      </Box>
    </LightTooltip>
  )
}

function CopyButton() {
  const updateState = useStore((state) => state.updateState)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'Folder' : 'File'
  return (
    <IconButton
      variant="text"
      Icon={CopyIcon}
      label={`Copy ${type}`}
      onClick={() => updateState({ dialog: `copy${type}` })}
    />
  )
}

function MoveButton() {
  const updateState = useStore((state) => state.updateState)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'Folder' : 'File'
  return (
    <IconButton
      variant="text"
      Icon={MoveIcon}
      label={`Move ${type}`}
      onClick={() => updateState({ dialog: `move${type}` })}
    />
  )
}
