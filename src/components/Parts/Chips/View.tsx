import * as React from 'react'
import Chip from '@mui/material/Chip'
import TroubleshootIcon from '@mui/icons-material/Troubleshoot'
import LightTooltip from '../Tooltips/Light'

export interface ViewChipProps {
  onClick: () => void
}

export default function ViewChip(props: ViewChipProps) {
  return (
    <LightTooltip title="Create a SQL query">
      <Chip
        onClick={props.onClick}
        label="SQL"
        color="primary"
        icon={<TroubleshootIcon />}
        size="medium"
        sx={{
          width: '6vw',
          height: '100%',
          borderLeft: 'solid 1px #ddd',
          borderRadius: '3px',
        }}
      />
    </LightTooltip>
  )
}
