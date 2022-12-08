import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import FileNavigator from '../FileNavigator'
import Columns from '../Columns'
import { DialogContent } from '@mui/material'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

interface MoveButtonProps {
  label: string
  color?: 'info' | 'warning' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  copyFile: (destination: string) => void
  moveFile: (destination: string) => void
  listFolders: () => Promise<void>
}

export default function MoveButton(props: MoveButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [destination, setDestination] = React.useState<string | null>(null)
  const [copyFile, setCopyFile] = React.useState<boolean>(false)
  if (!props.listFolders()) return null
  const onMoveButtonClick = () => {
    if (!open) {
      props.listFolders()
    }
    setCopyFile(false)
    setOpen(!open)
  }
  const onDialogBoxCancel = () => {
    setOpen(false)
  }
  const onCancelMove = () => {
    setDestination(null)
    setOpen(false)
  }
  const onFolderSelect = (destination: string | null) => {
    setDestination(destination)
  }
  return (
    <React.Fragment>
      <Button
        disabled={props.disabled}
        color={props.color}
        title={props.label}
        variant={props.variant}
        onClick={onMoveButtonClick}
      >
        {props.label}
      </Button>
      <Dialog fullWidth maxWidth="sm" onClose={onDialogBoxCancel} open={open}>
        <DialogTitle>
          Move/Copy To
          <IconButton
            aria-label="close"
            onClick={onDialogBoxCancel}
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
              <Checkbox
                disabled={destination === null}
                onChange={() => setCopyFile(!copyFile)}
                checked={copyFile}
              />
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
              onClick={() => {
                if (destination === null) return
                if (copyFile) {
                  props.copyFile(destination)
                } else {
                  props.moveFile(destination)
                }
                setOpen(false)
              }}
              disabled={destination === null}
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
    </React.Fragment>
  )
}
