import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { isDirectory, getFolderPath } from '../../../helpers'
import DialogContentText from '@mui/material/DialogContentText'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import TextField from '@mui/material/TextField'
import { useStore } from '../../Controllers/Files/store'

interface FolderButtonProps {
  color?: 'info' | 'warning' | 'secondary'
  disabled?: boolean
  fullWidth?: boolean
  marginR?: number
  variant?: 'contained' | 'outlined' | 'text'
  closeMenu: () => void
}

export default function FolderButton(props: FolderButtonProps) {
  const path = useStore((state) => state.path)
  const [open, setOpen] = React.useState(false)
  const [newDirectoryName, setNewDirectoryName] = React.useState('')
  const [error, setError] = React.useState(false)
  const paths = useStore((state: any) => state.paths)
  const createFolder = useStore((state) => state.createFolder)

  const onUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDirectoryName(event.target.value)
  }
  const handleCancel = () => setOpen(false)
  const handleClickOpen = () => setOpen(true)
  const handleCreateDirectory = () => {
    let newDirectoryPath = newDirectoryName
    let currentDirectory = path
    if (!currentDirectory) currentDirectory = ''

    // If a path is a file
    if (!isDirectory(currentDirectory)) currentDirectory = getFolderPath(currentDirectory)
    if (currentDirectory !== '') {
      newDirectoryPath = `${currentDirectory}/${newDirectoryPath}`
    }

    if (paths.includes(newDirectoryPath)) {
      setError(true)
      return
    }
    createFolder(newDirectoryPath)
    setOpen(false)
    props.closeMenu()
  }
  return (
    <React.Fragment>
      <Button
        disabled={props.disabled}
        variant={props.variant}
        component="label"
        onClick={handleClickOpen}
        color={props.color || 'info'}
      >
        <CreateNewFolderIcon sx={{ mr: props.marginR }} />
        Folder
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {path && isDirectory(path) && path}
          </DialogContentText>
          <TextField
            error={error}
            size="small"
            value={newDirectoryName}
            onChange={onUserInput}
            helperText={error && 'File already exists.'}
          />
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateDirectory}
            aria-label="accept"
            color="secondary"
            variant="outlined"
            disabled={newDirectoryName === ''}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
