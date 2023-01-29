import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import TextField from '@mui/material/TextField'
import { getFolderPath } from '../../../../helpers'
import { useStore, selectors } from '../store'

export default function FolderDialog() {
  const path = useStore((state) => state.path)
  const filePaths = useStore(selectors.filePaths)
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const [newDirectoryName, setNewDirectoryName] = React.useState('')
  const [error, setError] = React.useState(false)
  const paths = useStore((state: any) => state.paths)
  const createFolder = useStore((state) => state.createFolder)

  const onUserInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewDirectoryName(event.target.value)
  }
  const handleCancel = () => setDialog(undefined)
  const handleCreateDirectory = () => {
    let newDirectoryPath = newDirectoryName
    let currentDirectory = path
    if (!currentDirectory) currentDirectory = ''

    // If a path is a file
    if (filePaths.includes(currentDirectory)) {
      currentDirectory = getFolderPath(currentDirectory)
    }
    if (currentDirectory !== '') {
      newDirectoryPath = `${currentDirectory}/${newDirectoryPath}`
    }

    if (paths.includes(newDirectoryPath)) {
      setError(true)
      return
    }
    createFolder(newDirectoryPath)
    setDialog()
  }
  return (
    <Dialog
      open={dialog === 'folder'}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">New Folder</DialogTitle>
      <DialogContent>
        <DialogContentText id="dialog-description">
          {path && !filePaths.includes(path)}
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
  )
}
