import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuPanel from '../../Parts/Panels/Menu'
import EditorHelp from '../Base/Help'
import DialectSection from './Sections/Dialect'
import FormatSection from './Sections/Format'
import TypeSection from './Sections/Type'
import { useTheme } from '@mui/material/styles'
import { useStore } from './store'
import * as types from '../../../types'

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
  const type = useStore((state) => state.type)
  const format = useStore((state) => state.format)
  const section = useStore((state) => state.section)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'dialect', name: 'Dialect' },
    { section: 'dialect/type', name: capitalize(type) || 'Type' },
    { section: 'dialect/format', name: capitalize(format) || 'Format' },
  ]
  return (
    <MenuPanel
      menuItems={MENU_ITEMS}
      selected={section}
      defaultExpanded={['dialect']}
      onSelect={(section) => {
        updateHelp(section)
        updateState({ section })
      }}
    >
      <DialectSection />
      <TypeSection />
      <FormatSection />
    </MenuPanel>
  )
}

function SectionsWithoutMenu() {
  const section = useStore((state) => state.externalMenu?.section)
  if (!section) return null
  return (
    <Box>
      <Box hidden={section !== 'dialect'}>
        <DialectSection />
      </Box>
      <Box hidden={section !== 'dialect/type'}>
        <TypeSection />
      </Box>
      <Box hidden={section !== 'dialect/format'}>
        <FormatSection />
      </Box>
    </Box>
  )
}
