import noop from 'lodash/noop'
import { StyledTextField } from './Input'
import InputLabel from '@mui/material/InputLabel'

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
    <div style={{ flexGrow: 1, width: '100%'}}>
      <InputLabel shrink={false}>{props.label}</InputLabel>
      <StyledTextField
        multiline
        placeholder={props.placeholder}
        name={props.name || props.label}
        rows={props.rows}
        type={props.type}
        margin="normal"
        style={{ maxWidth: '350px', marginTop: '5px' }}
        value={props.value}
        size={props.size || 'small'}
        onChange={(ev) => props.onChange(ev.target.value as any)}
        onFocus={onFocus}
        autoFocus={props.autoFocus}
        required={props.required}
      />
    </div>
  )
}