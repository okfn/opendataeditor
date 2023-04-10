import * as React from 'react'
import Chip from '@mui/material/Chip'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'

export interface ChartChipProps {
  onClick: () => void
}

export default function ChartChip(props: ChartChipProps) {
  return (
    <Chip
      onClick={props.onClick}
      label="CHART"
      color="primary"
      icon={<LeaderboardIcon />}
      size="medium"
      sx={{
        height: '100%',
        borderLeft: 'solid 1px #ddd',
        borderRadius: '3px',
      }}
    />
  )
}
