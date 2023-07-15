import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import Query from './Sections/Query'
import EditorHelp from '../Base/Help'
import { useStore } from './store'

export default function Layout() {
  const helpItem = useStore((state) => state.helpItem)
  return (
    <Box sx={{ height: '100%' }}>
      <Columns spacing={3} layout={[9, 3]}>
        <Box sx={{ paddingLeft: 3 }}>
          <Query />
        </Box>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
