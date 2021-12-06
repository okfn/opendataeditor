import * as React from 'react'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import ClearIcon from '@mui/icons-material/Clear'

interface HeadingSearchProps {
  value?: string
  onChange: (value?: string) => void
}

export default function HeadingSearch(props: HeadingSearchProps) {
  return (
    <TextField
      size="small"
      label="Search"
      value={props.value || ''}
      onChange={(ev) => props.onChange(ev.target.value)}
      InputProps={{ endAdornment: props.value ? <ResetButton {...props} /> : undefined }}
    />
  )
}

function ResetButton(props: HeadingSearchProps) {
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
