import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import OneButtonDialog, { ConfirmDialogProps } from './OneButton'

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
    <OneButtonDialog {...rest} onConfirm={handleConfirm} disabled={!value}>
      <TextField
        error={!!errorMessage}
        helperText={errorMessage || ' '}
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
        sx={{ marginBottom: 1,
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'gray',
            },
            '&:hover fieldset': {
              borderColor: '#00D1FF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00D1FF',
            },
          },
         }}
      />
      {props.children}
    </OneButtonDialog>
  )
}
