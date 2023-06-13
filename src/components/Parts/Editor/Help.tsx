import * as React from 'react'
import Box from '@mui/material/Box'
import HelpCard from '../HelpCard'
import * as types from '../../../types'

interface EditorHelpProps {
  helpItem: types.IHelpItem
}

export default function EditorHelp(props: EditorHelpProps) {
  const { helpItem } = props
  return (
    <Box sx={{ height: '100%' }}>
      <HelpCard title={helpItem.title} subtitle={helpItem.path} link={helpItem.link}>
        {helpItem.description}
      </HelpCard>
    </Box>
  )
}
