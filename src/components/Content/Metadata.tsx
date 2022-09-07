import * as React from 'react'
import Resource from '../Resource'
import Box from '@mui/material/Box'
import { useStore } from './store'

export default function Layout() {
  const resource = useStore((state) => state.resource)
  if (!resource) return null
  return (
    <Box>
      <Resource withTabs={true} descriptor={resource} />
    </Box>
  )
}
