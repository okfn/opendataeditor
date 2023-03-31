import * as React from 'react'
import FileSaver from 'file-saver'
import Download from '@mui/icons-material/Download'
import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import RenameIcon from '@mui/icons-material/Edit'
import ManageIcon from '@mui/icons-material/FileCopy'
import IconButton from '../../../Parts/Buttons/IconButton'
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
      <DownloadButton />
      <CopyButton />
      <MoveButton />
      <RenameButton />
    </DropdownButton>
  )
}

function DownloadButton() {
  const path = useStore((state) => state.path)
  const downloadFile = useStore((state) => state.downloadFile)
  return (
    <IconButton
      label="Download File"
      variant="text"
      Icon={Download}
      onClick={async () => {
        const bytes = await downloadFile()
        if (bytes) {
          const blob = new Blob([bytes])
          const filename = path?.split('/').slice(-1).join()
          FileSaver.saveAs(blob, filename)
        }
      }}
    />
  )
}

function CopyButton() {
  const isFolder = useStore(selectors.isFolder)
  const setDialog = useStore((state) => state.setDialog)
  return (
    <IconButton
      label={`Copy ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      Icon={MoveIcon}
      onClick={() => setDialog('folder/copy')}
    />
  )
}

function MoveButton() {
  const isFolder = useStore(selectors.isFolder)
  const setDialog = useStore((state) => state.setDialog)
  return (
    <IconButton
      label={`Move ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      Icon={CopyIcon}
      onClick={() => setDialog('folder/move')}
    />
  )
}

function RenameButton() {
  const isFolder = useStore(selectors.isFolder)
  const setDialog = useStore((state) => state.setDialog)
  return (
    <IconButton
      label={`Rename ${isFolder ? 'Folder' : 'File'}`}
      variant="text"
      Icon={RenameIcon}
      onClick={() => setDialog('name/rename')}
    />
  )
}
