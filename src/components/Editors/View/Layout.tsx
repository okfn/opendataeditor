import * as React from 'react'
import camelCase from 'lodash/camelCase'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import Query from './Sections/Query'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'

const LABELS = ['Query']

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={2} layout={[9, 3]}>
        <VerticalTabs
          labels={LABELS}
          onChange={(index) => {
            updateHelp(camelCase(LABELS[index]))
          }}
        >
          <Query />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
