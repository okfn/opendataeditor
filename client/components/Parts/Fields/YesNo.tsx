import noop from 'lodash/noop'
import MenuItem from '@mui/material/MenuItem'
import { StyledTextField } from './Input'
import InputLabel from '@mui/material/InputLabel'

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
    <div style={{ flexGrow: 1, width: '100%'}}>
      <InputLabel shrink={false}>{props.label}</InputLabel>
      <StyledTextField
        select
        style= {{ flexGrow: 1, maxWidth: '350px', marginTop: '5px' }}
        margin="normal"
        size={props.size || 'small'}
        value={props.value ? 'yes' : 'no'}
        onChange={(ev) => props.onChange(ev.target.value === 'yes')}
        onFocus={onFocus}
      >
        <MenuItem value={'yes'}>Yes</MenuItem>
        <MenuItem value={'no'}>No</MenuItem>
      </StyledTextField>
    </div>
  )
}
