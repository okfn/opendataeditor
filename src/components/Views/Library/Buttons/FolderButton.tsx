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

interface FolderButtonProps {
  color?: 'info' | 'warning' | 'secondary'
  disabled?: boolean
  marginR?: number
  show?: boolean
  variant?: 'contained' | 'outlined' | 'text'
  closeMenu: () => void
}

export default function FolderButton(props: FolderButtonProps) {
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
    props.closeMenu()
  }
  React.useEffect(() => {
    if (!path) return
    if (path && isDirectory(path)) setCurrentDirectory(path)
  }, [])
  return (
    <React.Fragment>
      {props.show && (
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
      )}
      <Dialog
        open={open}
        onClose={handleCancel}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">New Folder</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            {currentDirectory}
          </DialogContentText>
          <TextField size="small" value={newDirectoryName} onChange={onUserInput} />
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
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  )
}
