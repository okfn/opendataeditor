import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { isDirectory } from '../../../../helpers'
import DialogContentText from '@mui/material/DialogContentText'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import TextField from '@mui/material/TextField'
import { useStore } from '../../../Editors/Files/store'

interface CreateDirectoryButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
}

export default function CreateDirectoryButton(props: CreateDirectoryButtonProps) {
  const path = useStore((state) => state.path)
  const createDirectory = useStore((state) => state.createDirectory)
  const [open, setOpen] = React.useState(false)
  const [newDirectoryName, setNewDirectoryName] = React.useState('')
  const [currentDirectory, setCurrentDirectory] = React.useState('')

  const onUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDirectoryName(event.target.value)
  }
  const handleCancel = () => setOpen(false)
  const handleClickOpen = () => setOpen(true)
  const handleCreateDirectory = () => {
    let directoryPath = newDirectoryName
    if (currentDirectory !== '') {
      directoryPath = `${currentDirectory}/${directoryPath}`
    }
    createDirectory(directoryPath)
    setOpen(false)
  }
  React.useEffect(() => {
    if (!path) return
    if (path && isDirectory(path)) setCurrentDirectory(path)
  }, [])
  return (
    <React.Fragment>
      <Button
        disabled={props.disabled}
        variant={props.variant}
        component="label"
        onClick={handleClickOpen}
      >
        <CreateNewFolderIcon />
        Folder
      </Button>
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {currentDirectory}
          </DialogContentText>
          <TextField size="small" value={newDirectoryName} onChange={onUserInput} />
        </DialogContent>
        <DialogActions className="dialog-actions-dense">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button onClick={handleCreateDirectory}>Create</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
