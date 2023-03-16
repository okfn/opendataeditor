import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import { useStore, selectors } from '../store'
import { Box } from '@mui/system'
import Columns from '../../../Parts/Columns'
import { Cancel, Upload } from '@mui/icons-material'
import ActionButtonContent from '../../../Parts/ActionButtonContent'

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
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
          >
            <ActionButtonContent label={'Cancel'} icon={Cancel} />
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCreate}
            aria-label="accept"
            color="secondary"
            variant="contained"
            disabled={!url}
          >
            <ActionButtonContent label={'Upload'} icon={Upload} />
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}