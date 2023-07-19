import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import Channel from './Sections/Channel/Channel'
import Transform from './Sections/Transform/Transform'
import { useStore } from './store'
import MenuTree from '../../Parts/Trees/Menu'
import * as types from '../../../types'
import Chart from './Sections/Chart/Chart'

// const LABELS = ['Chart', 'Channels', 'Transforms']

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
    { section: 'chart', name: 'Chart' },
    { section: 'chart/general', name: 'General' },
    { section: 'chart/channel', name: 'Channel' },
    { section: 'chart/transform', name: 'Transform' },
  ]
  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={MENU_ITEMS}
          selected={section}
          defaultExpanded={['chart']}
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
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <Box>
        <Box hidden={section !== 'chart/general'}>
          <Chart />
        </Box>
        <Box hidden={section !== 'chart/channel'}>
          <Channel />
        </Box>
        <Box hidden={section !== 'chart/transform'}>
          <Transform />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
