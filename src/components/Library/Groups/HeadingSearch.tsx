import * as React from 'react'
import TextField from '@mui/material/TextField'

interface HeadingSearchProps {
  value?: string
  onChange: (value: string) => void
}

export default function HeadingSearch(props: HeadingSearchProps) {
  return (
    <TextField
      label="Search"
      value={props.value || ''}
      onChange={(ev) => props.onChange(ev.target.value)}
      size="small"
    />
  )
}
