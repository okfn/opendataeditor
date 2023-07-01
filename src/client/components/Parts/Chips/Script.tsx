import * as React from 'react'
import Chip from '@mui/material/Chip'
import TerminalIcon from '@mui/icons-material/Terminal'
import LightTooltip from '../Tooltips/Light'

export interface PythonChipProps {
  onClick: () => void
}

export default function PythonChip(props: PythonChipProps) {
  return (
    <LightTooltip title="Create a Python script">
      <Chip
        onClick={props.onClick}
        color="primary"
        label="Script"
        icon={<TerminalIcon />}
        size="medium"
        sx={{
          height: '100%',
          borderLeft: 'solid 1px #ddd',
          borderRadius: '3px',
        }}
      />
    </LightTooltip>
  )
}
