import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import { useStore, selectors } from '../store'
import { Box } from '@mui/system'
import Columns from '../../../Parts/Columns'

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
      fullWidth
      maxWidth="sm"
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
      <DialogContent sx={{ py: 0 }}>
        <TextField fullWidth size="small" value={name} onChange={handleChange} />
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCreate}
            aria-label="accept"
            color="secondary"
            variant="contained"
            disabled={!name}
          >
            {dialog === 'name/create' ? 'Create' : 'Rename'}
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
