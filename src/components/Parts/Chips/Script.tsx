import * as React from 'react'
import Chip from '@mui/material/Chip'
import TerminalIcon from '@mui/icons-material/Terminal'

export interface PythonChipProps {
  onClick: () => void
}

export default function PythonChip(props: PythonChipProps) {
  return (
    <Chip
      title="Create a Python script"
      onClick={props.onClick}
      label="Python"
      color="primary"
      icon={<TerminalIcon />}
      size="medium"
      sx={{
        width: '6vw',
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        borderRadius: '3px',
      }}
    />
  )
}
