import * as React from 'react'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import ManageIcon from '@mui/icons-material/FileCopy'
import DefaultButton from '../../../Parts/Buttons/DefaultButton'
import DropdownButton from '../../../Parts/Buttons/DropdownButton'
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
      <MoveButton />
      <CopyButton />
    </DropdownButton>
  )
}

function MoveButton() {
  const isFolder = useStore(selectors.isFolder)
  const setDialog = useStore((state) => state.setDialog)
  return (
    <DefaultButton
      label={`Copy ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      icon={<CopyIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => setDialog('move')}
    />
  )
}

function CopyButton() {
  const isFolder = useStore(selectors.isFolder)
  const setDialog = useStore((state) => state.setDialog)
  return (
    <DefaultButton
      label={`Move ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      icon={<MoveIcon fontSize="small" sx={{ mr: 1 }} />}
      onClick={() => setDialog('copy')}
    />
  )
}
