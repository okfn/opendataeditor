import * as React from 'react'
import Box from '@mui/material/Box'
import Action from './Action'
import Content from './Content'
import Header from './Header'
import Welcome from './Welcome'
import { useStore } from './store'

export default function Layout() {
  const editor = useStore((state) => state.editor)
  return (
    <Box>
      <Header />
      {editor ? (
        <Box>
          <Content />
          <Action />
        </Box>
      ) : (
        <Welcome />
      )}
    </Box>
  )
}
