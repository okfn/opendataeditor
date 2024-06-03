import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import ConfirmDialog, { ConfirmDialogProps } from './Confirm'

export interface InputDialogProps extends Omit<ConfirmDialogProps, 'onConfirm'> {
  value?: string
  prefix?: string
  placholder?: string
  spellcheck?: boolean
  onConfirm?: (value: string) => void,
  textFieldError? : boolean,
  errorHelperText?: string
}

export default function InputDialog(props: InputDialogProps) {
  const { value: initValue, prefix, placholder, spellcheck, onConfirm, textFieldError, errorHelperText, ...rest } = props
  const [value, setValue] = React.useState(initValue || '')

  const handleConfirm = () => onConfirm && onConfirm(value)
  return (
    <ConfirmDialog {...rest} onConfirm={handleConfirm}>
      <TextField
        error={textFieldError}
        helperText={textFieldError ? errorHelperText : ' '}
        autoFocus
        fullWidth
        size="small"
        value={value}
        placeholder={placholder}
        onChange={(ev) => setValue(ev.target.value)}
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
