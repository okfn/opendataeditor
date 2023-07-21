import * as React from 'react'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import Channel from './Sections/Channel/Channel'
import Transform from './Sections/Transform/Transform'
import { useStore } from './store'
import MenuTree from '../../Parts/Trees/Menu'
import Chart from './Sections/Chart/Chart'
import LayerChart from './Sections/Chart/LayerChart'

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
            updateHelp(section)
            updateState({ section })
            const layerIndex = layers.findIndex((elem) => elem === section.split('/')[0])
            updateState({ layerIndex })
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
  const layerName = section.split('/')[0]

  return (
    <Columns spacing={3} layout={[9, 3]}>
      <Box>
        <Box hidden={section !== `${layerName}/chart`}>
          {layerName === 'general' ? <Chart /> : <LayerChart />}
        </Box>
        <Box hidden={section !== `${layerName}/channel`}>
          <Channel />
        </Box>
        <Box hidden={section !== `${layerName}/transform`}>
          <Transform />
        </Box>
      </Box>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}
