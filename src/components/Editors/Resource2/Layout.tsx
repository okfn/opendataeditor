import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import Resource from './Sections/Resource'
import Checksum from './Sections/Checksum'
import License from './Sections/License'
import { useStore } from './store'

const LABELS = ['Resource', 'Checksums', 'Licenses']

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs
          labels={LABELS}
          onChange={(index) => updateHelp(`resource/${camelCase(LABELS[index])}`)}
        >
          <Resource />
          <Checksum />
          <License />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
