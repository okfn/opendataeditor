import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuPanel from '../../Parts/Panels/Menu'
import EditorHelp from '../Base/Help'
import SchemaSection from './Sections/Schema'
import FieldSection from './Sections/Field'
import ForeignKeySection from './Sections/ForeignKey'
import { useStore } from './store'
import * as types from '../../../types'

const MENU_ITEMS: types.IMenuItem[] = [
  { section: 'schema', name: 'Schema' },
  { section: 'schema/field', name: 'Fields' },
  { section: 'schema/foreignKey', name: 'Foreign Keys' },
]

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        {!externalMenu ? <SectionsWithMenu /> : <SectionsWithoutMenu />}
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}

function SectionsWithMenu() {
  const section = useStore((state) => state.section)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <MenuPanel
      menuItems={MENU_ITEMS}
      selected={section}
      defaultExpanded={['schema']}
      onSelect={(section) => {
        updateHelp(section)
        updateState({ section })
      }}
    >
      <SchemaSection />
      <FieldSection />
      <ForeignKeySection />
    </MenuPanel>
  )
}

function SectionsWithoutMenu() {
  const section = useStore((state) => state.externalMenu?.section)
  if (!section) return null
  return (
    <Box>
      <Box hidden={section !== 'schema'}>
        <SchemaSection />
      </Box>
      <Box hidden={section !== 'schema/field'}>
        <FieldSection />
      </Box>
      <Box hidden={section !== 'schema/foreignKey'}>
        <ForeignKeySection />
      </Box>
    </Box>
  )
}
