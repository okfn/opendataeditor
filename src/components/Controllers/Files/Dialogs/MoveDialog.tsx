import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import Columns from '../../../Parts/Columns'
import { DialogContent } from '@mui/material'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FileNavigator from '../Dialogs/FileNavigator'
import { useStore } from '../store'

export default function MoveDialog() {
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const handleClose = () => setDialog(undefined)
  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleClose} open={dialog === 'move'}>
      <DialogTitle>
        Move/Copy To
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          borderStyle: 'dotted',
          borderWidth: 1,
          borderRadius: 1,
          marginLeft: 3,
          marginRight: 3,
        }}
      >
        <FileNavigator onFolderSelect={onFolderSelect} />
      </DialogContent>
      <FormGroup sx={{ marginLeft: 3 }}>
        <FormControlLabel
          control={
            <Checkbox onChange={() => setCopyFile(!copyFile)} checked={copyFile} />
          }
          label="Create a copy"
        />
      </FormGroup>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant="contained"
            size="small"
            onClick={onMove}
            disabled={error}
            aria-label="move selected right"
            color="secondary"
          >
            {copyFile === true ? 'Copy' : 'Move'}
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            variant="contained"
            size="small"
            onClick={onCancelMove}
            aria-label="move selected right"
            color="warning"
          >
            Cancel
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
