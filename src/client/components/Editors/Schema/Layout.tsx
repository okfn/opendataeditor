import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuTree from '../../Parts/Trees/Menu'
import EditorHelp from '../Base/Help'
import Schema from './Sections/Schema'
import Field from './Sections/Field'
import ForeignKey from './Sections/ForeignKey'
import { useStore } from './store'
import * as types from '../../../types'

const MENU_ITEMS: types.IMenuItem[] = [
  { section: 'schema', name: 'Schema' },
  { section: 'field', name: 'Fields' },
  { section: 'foreignKey', name: 'Foreign Keys' },
]

export default function Layout() {
  const theme = useTheme()
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const section = useStore((state) => state.section)
  const updateState = useStore((state) => state.updateState)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <Columns spacing={3} layout={[3, 9]}>
          <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
            <MenuTree
              menuItems={MENU_ITEMS}
              selected={section}
              onSelect={(section) => {
                updateHelp(section)
                updateState({ section })
              }}
            />
          </Box>
          <Box>
            <Box hidden={section !== 'schema'}>
              <Schema />
            </Box>
            <Box hidden={section !== 'field'}>
              <Field />
            </Box>
            <Box hidden={section !== 'foreignKey'}>
              <ForeignKey />
            </Box>
          </Box>
        </Columns>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
