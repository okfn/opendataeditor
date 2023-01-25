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
import { isDirectory } from '../../../helpers'

interface MoveButtonProps {
  label: string
  color?: 'info' | 'warning' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  path?: string | undefined
  copyFile: (destination: string) => void
  moveFile: (destination: string) => void
  listFolders: () => Promise<void>
}

export default function MoveButton(props: MoveButtonProps) {
  const [open, setOpen] = React.useState(false)
  const [destination, setDestination] = React.useState<string | null>(null)
  const [copyFile, setCopyFile] = React.useState<boolean>(false)
  const [error, setError] = React.useState<boolean>(false)

  if (!props.listFolders()) return null
  const onCancelMove = () => {
    setDestination(null)
    setOpen(false)
  }
  const onDialogBoxCancel = () => {
    setDestination(null)
    setOpen(false)
  }
  const onFolderSelect = (destination: string | null) => {
    if (!props.path) return
    setError(false)
    if (isDirectory(props.path)) {
      setError(props.path === destination)
    }
    setDestination(destination)
  }
  const onMoveButtonClick = () => {
    if (!open) {
      props.listFolders()
    }
    setCopyFile(false)
    setOpen(!open)
    if (destination === null) setError(true)
  }
  const onMove = () => {
    if (destination === null) return
    if (copyFile) {
      props.copyFile(destination)
    } else {
      props.moveFile(destination)
    }
    setOpen(false)
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
    </React.Fragment>
  )
}
