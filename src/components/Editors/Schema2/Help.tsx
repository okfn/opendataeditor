import * as React from 'react'
import Box from '@mui/material/Box'
import HelpCard from '../../Parts/HelpCard'
import { useStore } from './store'

export default function Help() {
  const helpItem = useStore((state) => state.helpItem)
  return (
    <Box sx={{ height: '100%' }}>
      <HelpCard title={helpItem.title} subtitle={helpItem.path} link={helpItem.link}>
        {helpItem.description}
      </HelpCard>
    </Box>
  )
}
