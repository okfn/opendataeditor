import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Cancel from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import Columns from '../../../Parts/Columns'
import IconButton from '../../../Parts/Buttons/Icon'
import { useStore } from '../store'

// TODO: extract shared into Parts
export default function SaveAsDialog() {
  const file = useStore((state) => state.file)
  if (!file) return null
  const dialog = useStore((state) => state.dialog)
  const updateState = useStore((state) => state.updateState)
  const saveAs = useStore((state) => state.saveAs)
  const [path, setPath] = React.useState(file.path)
  const handleCancel = () => updateState({ dialog: undefined })
  const handleSave = () => {
    updateState({ dialog: undefined })
    saveAs(path)
  }
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!dialog && dialog === 'saveAs'}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Save As</DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={path}
          onChange={(ev) => setPath(ev.target.value)}
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
            label="Save"
            sx={{ my: 0.5 }}
            onClick={handleSave}
            aria-label="accept"
            variant="contained"
            Icon={CheckIcon}
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
