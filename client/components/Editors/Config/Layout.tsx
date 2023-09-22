import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import MenuPanel from '../../Parts/Panels/Menu'
import EditorHelp from '../Base/Help'
import SystemSection from './Sections/System'
import ProjectSection from './Sections/Project'
import { useStore } from './store'
import * as types from '../../../types'

const MENU_ITEMS: types.IMenuItem[] = [
  { section: 'system', name: 'System' },
  { section: 'project', name: 'Project' },
]

export default function Layout() {
  const section = useStore((state) => state.section)
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  return (
    <Box sx={{ height: '100%' }}>
      <Columns spacing={3} layout={[9, 3]}>
        <MenuPanel
          menuItems={MENU_ITEMS}
          selected={section}
          onSelect={(section) => {
            updateHelp(section)
            updateState({ section })
          }}
        >
          <SystemSection />
          <ProjectSection />
        </MenuPanel>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Box>
  )
}
