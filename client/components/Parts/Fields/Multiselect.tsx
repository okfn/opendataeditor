import noop from 'lodash/noop'
import MenuItem from '@mui/material/MenuItem'
import { StyledTextField } from './Input'
import InputLabel from '@mui/material/InputLabel'

// TODO: rework? merge with SelectField?
// TODO: handle different value types properly (string/number/etc)

interface MultiselectFieldProps {
  type?: string
  label: string
  value: any
  options: string[] | { label: string; value: any }[]
  size?: 'small' | 'medium'
  onChange: (value: any) => void
  onFocus?: () => void
}

export default function MultiselectField(props: MultiselectFieldProps) {
  const onFocus = props.onFocus || noop
  const options = props.options.map((option) =>
    typeof option === 'string' ? { label: option, value: option } : option
  )

  return (
    <div>
    <InputLabel
      shrink={false}>
        {props.label}
    </InputLabel>
    <StyledTextField
      select
      fullWidth
      margin="normal"
      value={props.value}
      style={{ marginTop: '5px' }}
      size={props.size || 'small'}
      disabled={props.options.length < 2}
      onChange={(ev) => props.onChange((ev.target as any).value)}
      SelectProps={{ multiple: true }}
      onFocus={onFocus}
    >
      {options.map((option) => (
        <MenuItem key={option.label} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </StyledTextField>
    </div>
  )
}
