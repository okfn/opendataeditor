import noop from 'lodash/noop'
import MenuItem from '@mui/material/MenuItem'
import { StyledTextField } from './Input'

interface YesNoFieldProps {
  label: string
  value: boolean
  size?: 'small' | 'medium'
  onChange: (value: boolean) => void
  onFocus?: () => void
}

export default function YesNoField(props: YesNoFieldProps) {
  const onFocus = props.onFocus || noop
  return (
    <StyledTextField
      select
      style= {{ maxWidth: '350px' }}
      margin="normal"
      size={props.size || 'small'}
      label={props.label}
      value={props.value ? 'yes' : 'no'}
      onChange={(ev) => props.onChange(ev.target.value === 'yes')}
      onFocus={onFocus}
    >
      <MenuItem value={'yes'}>Yes</MenuItem>
      <MenuItem value={'no'}>No</MenuItem>
    </StyledTextField>
  )
}
