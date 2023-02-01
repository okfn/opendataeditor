import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '../Parts/Tabs'
import Files from '../Controllers/Files'
import { useStore } from './store'

export default function Layout() {
  const client = useStore((state) => state.client)
  const selectPath = useStore((state) => state.selectPath)
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Tabs labels={['_Projects', 'Resources']} index={1}>
        <React.Fragment></React.Fragment>
        <Files client={client} onFileChange={selectPath} />
      </Tabs>
    </Box>
  )
}
