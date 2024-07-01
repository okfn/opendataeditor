import CopyIcon from '@mui/icons-material/ContentCopy'
import MoveIcon from '@mui/icons-material/CopyAll'
import RuleIcon from '@mui/icons-material/Rule'
import ManageIcon from '@mui/icons-material/FileCopy'
import IconButton from '../../Parts/Buttons/Icon'
import DropdownButton from '../../Parts/Buttons/Dropdown'
import * as store from '@client/store'

export default function ManageButton() {
  const path = store.useStore((state) => state.path)
  const notIndexedFiles = store.useStore(store.getNotIndexedFiles)

  return (
    <DropdownButton
      disabled={!path && !notIndexedFiles.length}
      label="Manage"
      variant="text"
      icon={<ManageIcon fontSize="small" sx={{ mr: 1 }} />}
    >
      <CopyButton />
      <MoveButton />
      <IndexFilesButton />
    </DropdownButton>
  )
}

function CopyButton() {
  const path = store.useStore((state) => state.path)
  const isFolder = store.useStore(store.getIsFolder)
  const type = isFolder ? 'Folder' : 'File'

  return (
    <IconButton
      disabled={!path}
      variant="text"
      Icon={CopyIcon}
      label={`Copy ${type}`}
      onClick={() => store.openDialog(`copy${type}`)}
    />
  )
}

function MoveButton() {
  const path = store.useStore((state) => state.path)
  const isFolder = store.useStore(store.getIsFolder)
  const type = isFolder ? 'Folder' : 'File'

  return (
    <IconButton
      disabled={!path}
      variant="text"
      Icon={MoveIcon}
      label={`Move ${type}`}
      onClick={() => store.openDialog(`move${type}`)}
    />
  )
}

function IndexFilesButton() {
  const notIndexedFiles = store.useStore(store.getNotIndexedFiles)
  return (
    <IconButton
      disabled={!notIndexedFiles.length}
      variant="text"
      label="Index Files"
      Icon={RuleIcon}
      onClick={() => store.openDialog('indexFiles')}
    />
  )
}
