import Box from '@mui/material/Box'
import Columns from '../../Parts/Grids/Columns'
import EditorHelp from '../Base/Help'
import MenuTree from '../../Parts/Trees/Menu'
import Channels from './Sections/Channels'
import Transforms from './Sections/Transforms'
import Chart from './Sections/Chart'
import Layer from './Sections/Layer'
import Layers from './Sections/Layers'
import { useStore } from './store'

export default function Layout() {
  const section = useStore((state) => state.section)
  const updateHelp = useStore((state) => state.updateHelp)
  const updateState = useStore((state) => state.updateState)
  const menuItems = useStore((state) => state.menuItems)
  const layers = useStore((state) => state.layers)
  const helpItem = useStore((state) => state.helpItem)
  const layerIndex = useStore((state) => state.layerIndex)
  const menuItem = section.split('/')[1]
  return (
    <Columns spacing={3} layout={[2, 8]} columns={10}>
      <Box sx={{ padding: 2, borderRight: 'solid 1px #ddd', height: '100%' }}>
        <MenuTree
          menuItems={menuItems}
          selected={section}
          defaultExpanded={['general/chart']}
          onSelect={(section) => {
            const menuItem = section.split('/')[1] ?? 'chart'
            updateHelp(menuItem)
            const layerIndex = layers.findIndex((elem) => elem === section.split('/')[0])
            updateState({ layerIndex, section })
          }}
        />
      </Box>
      <Columns spacing={3} layout={[9, 3]}>
        <Box>
          <Box hidden={menuItem !== undefined}>
            {layerIndex === 0 ? <Chart /> : <Layer />}
          </Box>
          <Box hidden={menuItem !== 'channels'}>
            <Channels />
          </Box>
          <Box hidden={menuItem !== 'transforms'}>
            <Transforms />
          </Box>
          <Box hidden={menuItem !== 'layers'}>
            <Layers />
          </Box>
        </Box>
        <EditorHelp helpItem={helpItem} />
      </Columns>
    </Columns>
  )
}
