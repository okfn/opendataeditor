import noop from 'lodash/noop'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

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
    <TextField
      select
      fullWidth
      margin="normal"
      size={props.size || 'small'}
      label={props.label}
      value={props.value ? 'yes' : 'no'}
      onChange={(ev) => props.onChange(ev.target.value === 'yes')}
      onFocus={onFocus}
    >
      <MenuItem value={'yes'}>Yes</MenuItem>
      <MenuItem value={'no'}>No</MenuItem>
    </TextField>
  )
}
