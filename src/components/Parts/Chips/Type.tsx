import * as React from 'react'
import Chip from '@mui/material/Chip'
import LightTooltip from '../Tooltips/Light'

// TODO: create BaseChip

export interface TypeChipProps {
  type?: string
  onClick: () => void
}

export default function TypeChip(props: TypeChipProps) {
  const label = props.type || 'project'
  const title = props.type ? 'Change file name or file type' : 'Change the project'
  return (
    <LightTooltip title={title}>
      <Chip
        onClick={props.onClick}
        label={<strong>{label.toUpperCase()}</strong>}
        color="primary"
        size="medium"
        sx={{
          width: '6vw',
          height: '100%',
          borderRight: 'solid 1px #ddd',
          borderRadius: '3px',
        }}
      />
    </LightTooltip>
  )
}
