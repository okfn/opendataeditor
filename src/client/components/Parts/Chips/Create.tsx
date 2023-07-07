import * as React from 'react'
import Chip from '@mui/material/Chip'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import LightTooltip from '../Tooltips/Light'

// TODO: create BaseChip / move concrete to appliction?

export interface CreateChipProps {
  onClick: () => void
}

export default function CreateChip(props: CreateChipProps) {
  return (
    <LightTooltip title="Create a New File (chart/sql/etc)">
      <Chip
        onClick={props.onClick}
        color="primary"
        label="Create"
        icon={<AutoFixHighIcon />}
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
