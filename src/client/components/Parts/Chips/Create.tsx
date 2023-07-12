import * as React from 'react'
import Chip from '@mui/material/Chip'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import LightTooltip from '../Tooltips/Light'
import { useKeyPress } from 'ahooks'

// TODO: create BaseChip / move concrete to appliction?

export interface CreateChipProps {
  onClick: () => void
}

export default function CreateChip(props: CreateChipProps) {
  useKeyPress(['alt.c'], (event) => {
    event.preventDefault()
    props.onClick()
  })
  return (
    <LightTooltip title="Create chart, dataset, and more [Alt+C]">
      <Chip
        onClick={props.onClick}
        color="primary"
        label="CREATE"
        icon={<AutoFixHighIcon />}
        size="medium"
        sx={{
          width: '8vw',
          height: '100%',
          borderLeft: 'solid 1px #ddd',
          borderRadius: '3px',
        }}
      />
    </LightTooltip>
  )
}
