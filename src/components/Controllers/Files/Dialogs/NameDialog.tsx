import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import { useStore, selectors } from '../store'

export default function NameDialog() {
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const createFolder = useStore((state) => state.createFolder)
  const renameFile = useStore((state) => state.renameFile)
  const isFolder = useStore(selectors.isFolder)
  const [name, setName] = React.useState('')
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setName(ev.target.value)
  const handleCancel = () => setDialog(undefined)
  const handleCreate = () => {
    const action = dialog === 'name/create' ? createFolder : renameFile
    action(name)
    handleCancel()
  }
  return (
    <Dialog
      open={!!dialog && dialog.startsWith('name/')}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">
        {dialog === 'name/create'
          ? 'Create Folder'
          : `Rename ${isFolder ? 'Folder' : 'File'}`}
      </DialogTitle>
      <DialogContent>
        <TextField size="small" value={name} onChange={handleChange} />
      </DialogContent>
      <DialogActions className="dialog-actions-dense">
        <Button
          onClick={handleCancel}
          aria-label="cancel"
          color="warning"
          variant="contained"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCreate}
          aria-label="accept"
          color="secondary"
          variant="contained"
          disabled={!name}
        >
          {dialog === 'name/create' ? 'Create' : 'Rename'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
