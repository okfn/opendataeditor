import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { useStore } from '../store'

export default function NameDialog() {
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const createFolder = useStore((state) => state.createFolder)
  const [folder, setFolder] = React.useState('')
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setFolder(ev.target.value)
  const handleCancel = () => setDialog(undefined)
  const handleCreate = () => {
    createFolder(folder)
    handleCancel()
  }
  return (
    <Dialog
      open={!!dialog && dialog.startsWith('name/')}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Create Folder</DialogTitle>
      <DialogContent>
        <TextField size="small" value={folder} onChange={handleChange} />
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
          onClick={handleCreate}
          aria-label="accept"
          color="secondary"
          variant="outlined"
          disabled={!folder}
        >
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}
