import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../Views/Library/Tabs'
import FilesEditor from '../Editors/Files'
import LinksEditor from '../Editors/Links'
import ConfigEditor from '../Editors/Config'
import { useStore } from './store'

export default function Layout() {
  const client = useStore((state) => state.client)
  const selectPath = useStore((state) => state.selectPath)
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['Files', 'Links', 'Config']}>
        <FilesEditor client={client} onPathChange={selectPath} />
        <LinksEditor client={client} />
        <ConfigEditor client={client} />
      </Tabs>
    </Box>
  )
}
