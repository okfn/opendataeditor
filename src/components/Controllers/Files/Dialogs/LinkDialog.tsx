import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Cancel from '@mui/icons-material/Cancel'
import Upload from '@mui/icons-material/Upload'
import { useStore, selectors } from '../store'
import Columns from '../../../Parts/Columns'
import IconButton from '../../../Parts/Buttons/IconButton'

export default function LinkDialog() {
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const createFile = useStore((state) => state.createFile)
  const folderPath = useStore(selectors.folderPath)
  const [url, setURL] = React.useState('')
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setURL(ev.target.value)
  const handleCancel = () => setDialog(undefined)
  const handleCreate = () => {
    createFile(url)
    handleCancel()
  }
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!dialog && dialog.startsWith('link/')}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Upload Link</DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        {folderPath && folderPath}
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={url}
          onChange={handleChange}
          onKeyPress={(event) => {
            if (event.key === 'Enter') handleCreate()
          }}
        />
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <IconButton
            fullWidth
            label={'Cancel'}
            Icon={Cancel}
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
          />
          <IconButton
            fullWidth
            label={'Upload'}
            Icon={Upload}
            sx={{ my: 0.5 }}
            onClick={handleCreate}
            aria-label="accept"
            variant="contained"
            disabled={!url}
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
