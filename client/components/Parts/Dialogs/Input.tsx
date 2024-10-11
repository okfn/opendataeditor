import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import ConfirmDialog, { ConfirmDialogProps } from './Confirm'

export interface InputDialogProps extends Omit<ConfirmDialogProps, 'onConfirm'> {
  value?: string
  prefix?: string
  placholder?: string
  spellcheck?: boolean
  onChange?: (value: string) => void
  onConfirm?: (value: string) => void
  errorMessage?: string
}

export default function InputDialog(props: InputDialogProps) {
  const { prefix, placholder, spellcheck, onConfirm, errorMessage, ...rest } = props
  const [value, setValue] = React.useState(props.value || '')

  const handleConfirm = () => onConfirm && onConfirm(value)
  return (
    <ConfirmDialog
      {...rest}
      onConfirm={handleConfirm}
      disabled={props.disabled || !value}
    >
      <TextField
        error={!!errorMessage}
        helperText={errorMessage}
        autoFocus
        fullWidth
        size="small"
        value={value}
        placeholder={placholder}
        onChange={(ev) => {
          setValue(ev.target.value)
          props.onChange?.(ev.target.value)
        }}
        InputProps={{
          inputProps: { spellCheck: spellcheck || false },
          startAdornment: prefix ? (
            <InputAdornment position="start">{prefix}</InputAdornment>
          ) : undefined,
        }}
        sx={{ marginBottom: 1 }}
      />
      {props.children}
    </ConfirmDialog>
  )
}
