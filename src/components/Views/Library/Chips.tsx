import * as React from 'react'
import Chip from '@mui/material/Chip'

interface ChipProps {
  label: string
  variant?: string
  onDelete?: (id: string) => void
}

export default function BasicChip(props: ChipProps) {
  return <Chip label={props.label} variant="outlined" onDelete={props.onDelete} />
}
