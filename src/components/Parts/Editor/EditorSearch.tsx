import * as React from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ClearIcon from '@mui/icons-material/Clear'
import { noop } from 'lodash'

interface EditorSearchProps {
  value?: string
  onChange: (value?: string) => void
  onFocus?: (event?: any) => void
}

export default function EditorSearch(props: EditorSearchProps) {
  const onFocus = props.onFocus || noop
  return (
    <TextField
      fullWidth
      size="small"
      name="Search"
      label="Search"
      value={props.value || ''}
      onChange={(ev) => props.onChange(ev.target.value)}
      InputProps={{ endAdornment: props.value ? <ResetButton {...props} /> : undefined }}
      onFocus={onFocus}
    />
  )
}

function ResetButton(props: EditorSearchProps) {
  return (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        size="small"
        aria-label="Reset search"
        onClick={() => props.onChange()}
      >
        <ClearIcon />
      </IconButton>
    </InputAdornment>
  )
}
