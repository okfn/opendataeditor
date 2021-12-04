import * as React from 'react'
import Box from '@mui/material/Box'
import Data from './Data'
import Help from './Help'
import Config from './Config'
import { useStore } from '../store'

export default function Content() {
  const contentType = useStore((state) => state.contentType)

  // Components

  const Content = () => (
    <Box sx={{ p: 2 }}>
      <ActiveContent />
    </Box>
  )

  const ActiveContent = () => {
    switch (contentType) {
      case 'help':
        return <Help />
      case 'config':
        return <Config />
      case 'data':
        return <Data />
      default:
        return null
    }
  }

  return <Content />
}
