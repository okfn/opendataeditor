import * as React from 'react'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import RuleIcon from '@mui/icons-material/Rule'
import ManageIcon from '@mui/icons-material/FileCopy'
import IconButton from '../../Parts/Buttons/Icon'
import DropdownButton from '../../Parts/Buttons/Dropdown'
import { useStore, selectors } from '../store'

export default function ManageButton() {
  return (
    <DropdownButton
      label="Manage"
      variant="text"
      icon={<ManageIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <CopyButton />
      <MoveButton />
      <IndexButton />
    </DropdownButton>
  )
}

function CopyButton() {
  const path = useStore((state) => state.path)
  const updateState = useStore((state) => state.updateState)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'Folder' : 'File'
  return (
    <IconButton
      disabled={!path}
      variant="text"
      Icon={CopyIcon}
      label={`Copy ${type}`}
      onClick={() => updateState({ dialog: `copy${type}` })}
    />
  )
}

function MoveButton() {
  const path = useStore((state) => state.path)
  const updateState = useStore((state) => state.updateState)
  const isFolder = useStore(selectors.isFolder)
  const type = isFolder ? 'Folder' : 'File'
  return (
    <IconButton
      disabled={!path}
      variant="text"
      Icon={MoveIcon}
      label={`Move ${type}`}
      onClick={() => updateState({ dialog: `move${type}` })}
    />
  )
}

function IndexButton() {
  const updateState = useStore((state) => state.updateState)
  const notIndexedFiles = useStore(selectors.notIndexedFiles)
  return (
    <IconButton
      disabled={!notIndexedFiles.length}
      variant="text"
      label="Index Files"
      Icon={RuleIcon}
      onClick={() => updateState({ dialog: 'indexFiles' })}
    />
  )
}
