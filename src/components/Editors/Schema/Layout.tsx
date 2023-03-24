import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/VerticalTabs'
import EditorHelp from '../../Parts/Editor/EditorHelp'
import Schema from './Sections/Schema'
import Field from './Sections/Field'
import ForeignKey from './Sections/ForeignKey'
import { useStore } from './store'

const LABELS = ['Schema', 'Fields', 'Foreign Keys']

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const vtabIndex = useStore((state) => state.schemaState.vtabIndex)
  const updateSchemaState = useStore((state) => state.updateSchemaState)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <VerticalTabs
          index={vtabIndex}
          labels={LABELS}
          onChange={(index) => {
            updateHelp(camelCase(LABELS[index]))
            updateSchemaState({ vtabIndex: index })
          }}
        >
          <Schema />
          <Field />
          <ForeignKey />
        </VerticalTabs>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
