import * as React from 'react'
import Chip from '@mui/material/Chip'
import LightTooltip from '../Tooltips/Light'

// TODO: create BaseChip / move concrete to appliction?

export interface TypeChipProps {
  type?: string
}

export default function TypeChip(props: TypeChipProps) {
  const label = props.type || 'project'
  const title = props.type
    ? `Selected file type: ${props.type}`
    : 'Selected project: current'
  return (
    <LightTooltip title={title}>
      <Chip
        label={<strong>{label.toUpperCase()}</strong>}
        color="primary"
        size="medium"
        sx={{
          width: '8vw',
          height: '100%',
          borderRight: 'solid 1px #ddd',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      />
    </LightTooltip>
  )
}
