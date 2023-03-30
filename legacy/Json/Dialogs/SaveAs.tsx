import * as React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import Cancel from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import Columns from '../../../Parts/Columns'
import ButtonContent from '../../../Parts/ButtonContent'
import { useStore } from '../store'

// TODO: extract shared into Parts
export default function SaveAsDialog() {
  const file = useStore((state) => state.file)
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
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
          >
            <ButtonContent label="Cancel" icon={Cancel} />
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleSave}
            aria-label="accept"
            color="secondary"
            variant="contained"
          >
            <ButtonContent label="Save" icon={CheckIcon} />
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
