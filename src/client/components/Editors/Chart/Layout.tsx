import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import Channels from './Sections/Channels'
import Transforms from './Sections/Transforms'
import { useStore } from './store'
import MenuTree from '../../Parts/Trees/Menu'
import Chart from './Sections/Chart'
import Layer from './Sections/Layer'

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
  const layerItems = useStore((state) => state.layerItems)
  const addLayer = useStore((state) => state.addLayer)
  const layers = useStore((state) => state.layers)
  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={layerItems}
          selected={section}
          defaultExpanded={['chart']}
          onAddNew={addLayer}
          onSelect={(section) => {
            const menuItem = section.split('/')[1] ?? 'chart'
            updateHelp(menuItem)
            const layerIndex = layers.findIndex((elem) => elem === section.split('/')[0])
            updateState({ layerIndex, section })
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
  const layerIndex = useStore((state) => state.layerIndex)
  const menuItem = section.split('/')[1] ?? 'chart'
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <Box>
        <Box hidden={menuItem !== 'chart'}>
          {layerIndex === 0 ? <Chart /> : <Layer />}
        </Box>
        <Box hidden={menuItem !== 'channels'}>
          <Channels />
        </Box>
        <Box hidden={menuItem !== 'transforms'}>
          <Transforms />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
