import * as React from 'react'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Content from './Content'
import Header from './Header'
import Welcome from './Welcome'
import { useStore } from './store'

export default function Layout() {
  const editor = useStore((state) => state.editorState.editor)
  return (
    <Box>
      <Header />
      {editor ? (
        <Box>
          <Content />
          <Actions />
        </Box>
      ) : (
        <Welcome />
      )}
    </Box>
  )
}
