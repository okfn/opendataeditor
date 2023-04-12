import * as React from 'react'
import Chip from '@mui/material/Chip'
import TerminalIcon from '@mui/icons-material/Terminal'

export interface ViewChipProps {
  onClick: () => void
}

export default function ViewChip(props: ViewChipProps) {
  return (
    <Chip
      onClick={props.onClick}
      label="SQL"
      color="primary"
      icon={<TerminalIcon />}
      size="medium"
      sx={{
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        borderRadius: '3px',
      }}
    />
  )
}
