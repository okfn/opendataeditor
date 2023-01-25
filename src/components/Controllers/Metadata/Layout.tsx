import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Content from './Content'
import Publish from '../../Editors/Package/Publish/Publish'
import { useStore } from './store'
import Menu from './Menu'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const isPublish = useStore((state) => state.isPublish)
  const togglePublish = useStore((state) => state.togglePublish)
  const publishPackage = useStore((state) => state.publishPackage)
  return (
    <Box sx={{ position: 'relative' }}>
      <Menu />
      <Box sx={{ height }}>
        <Content />
      </Box>
      <Publish
        open={isPublish || false}
        togglePublish={togglePublish}
        publishPackage={publishPackage}
      />
    </Box>
  )
}
