import * as React from 'react'
import Chip from '@mui/material/Chip'
import TableRowsIcon from '@mui/icons-material/TableRows'
import LightTooltip from '../Tooltips/Light'

export interface ViewChipProps {
  onClick: () => void
}

export default function ViewChip(props: ViewChipProps) {
  return (
    <LightTooltip title="Create a SQL view">
      <Chip
        onClick={props.onClick}
        color="primary"
        label="View"
        icon={<TableRowsIcon />}
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
