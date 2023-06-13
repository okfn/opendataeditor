import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Cancel from '@mui/icons-material/Cancel'
import Create from '@mui/icons-material/Create'
import IconButton from '../../../Parts/Buttons/Icon'
import Columns from '../../../Parts/Columns'
import { useStore, selectors } from '../store'

export default function NameDialog() {
  const dialog = useStore((state) => state.dialog)
  const updateState = useStore((state) => state.updateState)
  const createFolder = useStore((state) => state.createFolder)
  const renameFile = useStore((state) => state.renameFile)
  const isFolder = useStore(selectors.isFolder)
  const path = useStore((state) => state.path)
  const folderPath = useStore(selectors.folderPath)
  const [name, setName] = React.useState('')
  const [folder, setFolder] = React.useState('')
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setName(ev.target.value)
  const handleCancel = () => updateState({ dialog: undefined })
  const handleCreate = () => {
    const action = dialog === 'name/create' ? createFolder : renameFile
    action(name)
    handleCancel()
  }
  const isCreate = dialog === 'name/create'
  React.useEffect(() => {
    if (!path) return
    console.log(path, isCreate, folderPath)
    if (!isCreate) {
      setName(path.split('/').slice(-1).join('/'))
      if (isFolder) {
        setFolder(path.split('/').slice(0, -1).join('/'))
        return
      }
    }
    if (!folderPath) return
    setFolder(folderPath)
  }, [])
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
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={name}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') handleCreate()
          }}
          InputProps={{
            startAdornment: folder ? (
              <InputAdornment position="start">{folder}&nbsp;/</InputAdornment>
            ) : undefined,
          }}
        />
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <IconButton
            fullWidth
            label="Cancel"
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
            Icon={Cancel}
          />
          <IconButton
            fullWidth
            label={dialog === 'name/create' ? 'Create' : 'Rename'}
            Icon={Create}
            sx={{ my: 0.5 }}
            onClick={handleCreate}
            aria-label="accept"
            variant="contained"
            disabled={!name}
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
