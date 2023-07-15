import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import EditorHelp from '../Base/Help'
import SchemaSection from './Sections/Schema'
import FieldSection from './Sections/Field'
import ForeignKeySection from './Sections/ForeignKey'
import { useStore } from './store'
import * as types from '../../../types'

export default function Layout() {
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <Box sx={{ height: '100%' }}>
      {!externalMenu ? <LayoutWithMenu /> : <LayoutWithoutMenu />}
    </Box>
  )
}

function LayoutWithMenu() {
  const section = useStore((state) => state.section)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'schema', name: 'Schema' },
    { section: 'schema/field', name: 'Fields' },
    { section: 'schema/foreignKey', name: 'Foreign Keys' },
  ]
  return (
    <Columns spacing={3} layout={[2, 10]}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={MENU_ITEMS}
          selected={section}
          defaultExpanded={['schema']}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
          }}
        />
      </Box>
      <LayoutWithoutMenu />
    </Columns>
  )
}

function LayoutWithoutMenu() {
  const section = useStore((state) => state.externalMenu?.section || state.section)
  const helpItem = useStore((state) => state.helpItem)
  if (!section) return null
  return (
    <Columns spacing={3} layout={[7, 3]} columns={10}>
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
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
