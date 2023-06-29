import * as React from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export interface LinearIndicatorProps extends LinearProgressProps {
  value: number
  labeled?: boolean
}

export default function LinearIndicator(props: LinearIndicatorProps) {
  const { labeled, ...rest } = props
  if (!labeled) <LinearProgress variant="determinate" {...rest} />
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" {...rest} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          rest.value
        )}%`}</Typography>
      </Box>
    </Box>
  )
}
