import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import Query from './Sections/Query'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <Box sx={{ paddingLeft: 3 }}>
          <Query />
        </Box>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
