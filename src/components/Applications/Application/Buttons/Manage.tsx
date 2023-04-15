import * as React from 'react'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import RenameIcon from '@mui/icons-material/Edit'
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
      <RenameButton />
    </DropdownButton>
  )
}

function CopyButton() {
  const isFolder = useStore(selectors.isFolder)
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      label={`Copy ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      Icon={MoveIcon}
      onClick={() => updateState({ dialog: 'folder/copy' })}
    />
  )
}

function MoveButton() {
  const isFolder = useStore(selectors.isFolder)
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      label={`Move ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      Icon={CopyIcon}
      onClick={() => updateState({ dialog: 'folder/move' })}
    />
  )
}

function RenameButton() {
  const isFolder = useStore(selectors.isFolder)
  const updateState = useStore((state) => state.updateState)
  return (
    <IconButton
      label={`Rename ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      Icon={RenameIcon}
      onClick={() => updateState({ dialog: 'name/rename' })}
    />
  )
}
