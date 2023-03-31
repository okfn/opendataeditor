import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import Dialect from './Sections/Dialect'
import Csv from './Sections/Csv'
import Excel from './Sections/Excel'
import Html from './Sections/Html'
import Json from './Sections/Json'
import Ods from './Sections/Ods'
import { useStore } from './store'

// TODO: support Excel/Json formats
const LABELS = ['Dialect', 'Csv', 'Excel', 'Html', 'Json', 'Ods']

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs
          labels={LABELS}
          onChange={(index) => updateHelp(camelCase(LABELS[index]))}
        >
          <Dialect />
          <Csv />
          <Excel />
          <Html />
          <Json />
          <Ods />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
