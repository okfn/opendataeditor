import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuPanel from '../../Parts/Panels/Menu'
import EditorHelp from '../Base/Help'
import CkanSection from './Sections/Ckan'
import { useStore } from './store'
import * as types from '../../../types'

const MENU_ITEMS: types.IMenuItem[] = [
  { section: 'ckan', name: 'Ckan' },
  { section: 'github', name: 'Github', disabled: true },
  { section: 'zenodo', name: 'Zenodo', disabled: true },
]

export default function Layout() {
  const theme = useTheme()
  const section = useStore((state) => state.section)
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <Box sx={{ height: theme.spacing(42) }}>
      <Columns spacing={3} layout={[9, 3]}>
        <MenuPanel
          menuItems={MENU_ITEMS}
          selected={section}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
          }}
        >
          <CkanSection />
        </MenuPanel>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
