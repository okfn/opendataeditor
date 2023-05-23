import * as React from 'react'
import Chip from '@mui/material/Chip'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'

export interface ViewChipProps {
  onClick: () => void
}

export default function ViewChip(props: ViewChipProps) {
  return (
    <Chip
      title="Create a SQL view"
      onClick={props.onClick}
      label="SQL"
      color="primary"
      icon={<TroubleshootIcon />}
      size="medium"
      sx={{
        width: '7vw',
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        borderRadius: '3px',
      }}
    />
  )
}
