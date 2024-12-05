import * as React from 'react'
import capitalize from 'lodash/capitalize'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import EditorHelp from '../Base/Help'
import DialectSection from './Sections/Dialect'
import FormatSection from './Sections/Format'
import { useStore } from './store'
import * as types from '../../../types'
import { t } from 'i18next'

export default function Layout() {
  const externalMenu = useStore((state) => state.externalMenu)
  return (
    <Box sx={{ height: '100%' }}>
      {!externalMenu ? <LayoutWithMenu /> : <LayoutWithoutMenu />}
    </Box>
  )
}

function LayoutWithMenu() {
  const format = useStore((state) => state.format)
  const section = useStore((state) => state.section)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const MENU_ITEMS: types.IMenuItem[] = [
    { section: 'dialect', name: t('dialect') },
    { section: 'dialect/format', name: capitalize(format) || t('format') },
  ]
  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={MENU_ITEMS}
          selected={section}
          defaultExpanded={['dialect']}
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
  const updateHelp = useStore((state) => state.updateHelp)
  const helpItem = useStore((state) => state.helpItem)
  React.useEffect(() => updateHelp(section), [section])
  if (!section) return null
  return (
    <Columns spacing={3} layout={[5, 3]} columns={8}>
      <Box>
        <Box hidden={section !== 'dialect'}>
          <DialectSection />
        </Box>
        <Box hidden={section !== 'dialect/format'}>
          <FormatSection />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
