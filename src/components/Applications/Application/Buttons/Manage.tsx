import * as React from 'react'
import capitalize from 'lodash/capitalize'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import ManageIcon from '@mui/icons-material/FileCopy'
import IconButton from '../../../Parts/Buttons/Icon'
import DropdownButton from '../../../Parts/Buttons/Dropdown'
import { useStore, selectors } from '../store'

export default function ManageButton() {
  const path = useStore((state) => state.path)
  return (
    <DropdownButton
      label="Manage"
      variant="text"
      icon={<ManageIcon fontSize="small" sx={{ mr: 1 }} />}
      disabled={!path}
    >
      <CopyButton />
      <MoveButton />
    </DropdownButton>
  )
}

function CopyButton() {
  const updateState = useStore((state) => state.updateState)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'folder' : 'file'
  return (
    <IconButton
      variant="text"
      Icon={CopyIcon}
      label={`Copy ${capitalize(type)}`}
      onClick={() => updateState({ dialog: `path/copy/${type}` })}
    />
  )
}

function MoveButton() {
  const updateState = useStore((state) => state.updateState)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'folder' : 'file'
  return (
    <IconButton
      variant="text"
      Icon={MoveIcon}
      label={`Move ${capitalize(type)}`}
      onClick={() => updateState({ dialog: `path/move/${type}` })}
    />
  )
}
