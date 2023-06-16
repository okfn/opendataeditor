import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import Cancel from '@mui/icons-material/Cancel'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import IconButton from '..//Buttons/Icon'
import Columns from '../Columns'

export interface InputDialogProps {
  open?: boolean
  title?: string
  description?: string
  value?: string
  prefix?: string
  placholder?: string
  spellcheck?: boolean
  Icon?: React.ElementType
  label?: string
  disabled?: boolean
  onCancel?: () => void
  onConfirm?: (value: string) => void
}

export default function InputDialog(props: InputDialogProps) {
  const [value, setValue] = React.useState(props.value || '')
  const handleCancel = () => props.onCancel && props.onCancel()
  const handleConfirm = () => props.onConfirm && props.onConfirm(value)
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!props.open}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">{props.title || 'Dialog'}</DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        {props.description && (
          <Box sx={{ marginBottom: 1, opacity: 0.6 }}>{props.description}</Box>
        )}
        <TextField
          autoFocus
          fullWidth
          size="small"
          value={value}
          placeholder={props.placholder}
          onChange={(ev) => setValue(ev.target.value)}
          onKeyPress={(event) => {
            if (event.key === 'Enter') handleConfirm()
          }}
          InputProps={{
            inputProps: { spellCheck: props.spellcheck || false },
            startAdornment: props.prefix ? (
              <InputAdornment position="start">{props.prefix}</InputAdornment>
            ) : undefined,
          }}
          sx={{ marginBottom: 1 }}
        />
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <IconButton
            fullWidth
            label="Cancel [esc]"
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
            Icon={Cancel}
          />
          <IconButton
            fullWidth
            label={`${props.label || 'Confirm'} [enter]`}
            Icon={props.Icon || CheckCircleIcon}
            sx={{ my: 0.5 }}
            onClick={handleConfirm}
            aria-label="accept"
            variant="contained"
            disabled={props.disabled}
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
