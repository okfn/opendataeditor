import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import EditorHelp from '../Base/Help'
import SchemaSection from './Sections/Schema'
import FieldsSection from './Sections/Fields'
import ForeignKeysSection from './Sections/ForeignKeys'
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
    { section: 'schema/fields', name: 'Fields' },
    { section: 'schema/foreignKeys', name: 'Foreign Keys' },
  ]
  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
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
    <Columns spacing={3} layout={[5, 3]} columns={8}>
      <Box>
        <Box hidden={section !== 'schema'}>
          <SchemaSection />
        </Box>
        <Box hidden={section !== 'schema/fields'}>
          <FieldsSection />
        </Box>
        <Box hidden={section !== 'schema/foreignKeys'}>
          <ForeignKeysSection />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
