import * as React from 'react'
import Chip from '@mui/material/Chip'
import LayersIcon from '@mui/icons-material/Layers'

export interface ViewChipProps {
  onClick: () => void
}

export default function ViewChip(props: ViewChipProps) {
  return (
    <Chip
      disabled
      title="Create a SQL View (coming soon)"
      onClick={props.onClick}
      label="SQL VIEW"
      color="primary"
      icon={<LayersIcon />}
      size="medium"
      sx={{
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        borderRadius: '3px',
      }}
    />
  )
}
