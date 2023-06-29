import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../Base/Help'
import CkanSection from './Sections/Ckan'
import { useStore } from './store'

const LABELS = ['Ckan', 'Github', 'Zenodo']
const DISABLED_LABELS = ['Github', 'Zenodo']

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
          <CkanSection />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
