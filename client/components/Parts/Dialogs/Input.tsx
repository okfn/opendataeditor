import * as React from 'react'
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField'
import ConfirmDialog, { ConfirmDialogProps } from './Confirm'
import * as helpers from '../../../helpers'

export interface InputDialogProps extends Omit<ConfirmDialogProps, 'onConfirm'> {
  value?: string
  prefix?: string
  placholder?: string
  spellcheck?: boolean
  onConfirm?: (value: string) => void
}

export default function InputDialog(props: InputDialogProps) {
  const { value: initValue, prefix, placholder, spellcheck, onConfirm, ...rest } = props
  const [value, setValue] = React.useState(initValue || '')
  const [textFieldError, setTextFieldError] = React.useState(false)
  const [errorHelperText, setErrorHelperText] = React.useState('')
  const handleConfirm = () => {
    if(value !== '' && helpers.isUrlValid(value)){
      setTextFieldError(false)
      return onConfirm && onConfirm(value)
    } else {
      setTextFieldError(true)
      if(value === '') { setErrorHelperText('Enter an URL') }
      else if(!helpers.isUrlValid(value)) { setErrorHelperText('Enter a valid URL') }
    }
  }
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
