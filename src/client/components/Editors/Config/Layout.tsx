import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../Base/Help'
import SystemSection from './Sections/System'
import { useStore } from './store'

const LABELS = ['System', 'Project']
const DISABLED_LABELS = ['Project']

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs
          labels={LABELS}
          disabledLabels={DISABLED_LABELS}
          onChange={(index) => updateHelp(camelCase(LABELS[index]))}
        >
          <SystemSection />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
