import TextField from '@mui/material/TextField'
import noop from 'lodash/noop'

// TODO: shall we open a modal editor for this field?

interface MultilineFieldProps {
  name?: string
  type?: string
  label: string
  value: any
  rows?: number
  size?: 'small' | 'medium'
  onChange: (value: any) => void
  onFocus?: () => void
  placeholder?: string
  autoFocus?: boolean
  required?: boolean
}

export default function MultilineField(props: MultilineFieldProps) {
  const onFocus = props.onFocus || noop
  return (
    <TextField
      multiline
      fullWidth
      placeholder={props.placeholder}
      name={props.name || props.label}
      rows={props.rows}
      type={props.type}
      margin="normal"
      style={{ width: '350px' }}
      label={props.label}
      value={props.value}
      size={props.size || 'medium'}
      onChange={(ev) => props.onChange(ev.target.value as any)}
      onFocus={onFocus}
      autoFocus={props.autoFocus}
      required={props.required}
    />
  )
}
