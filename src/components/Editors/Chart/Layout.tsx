import * as React from 'react'
import camelCase from 'lodash/camelCase'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../../Parts/Columns'
import VerticalTabs from '../../Parts/Tabs/Vertical'
import EditorHelp from '../Base/Help'
import Chart from './Sections/Chart/Chart'
import Channel from './Sections/Channel/Channel'
import Transform from './Sections/Transform/Transform'
import HorizontalTabs from '../../Parts/Tabs/DynamicHorizontal'
import { useStore } from './store'
import LayerChart from './Sections/Chart/LayerChart'

const LABELS = ['Chart', 'Channels', 'Transforms']

export default function Layout() {
  const theme = useTheme()
  const shallow = useStore((state) => state.shallow)
  return (
    <Box sx={{ height: theme.spacing(42), position: 'relative' }}>
      {shallow ? <Sections /> : <Groups />}
    </Box>
  )
}

function Sections() {
  const helpItem = useStore((state) => state.helpItem)
  const updateHelp = useStore((state) => state.updateHelp)
  const tabIndex = useStore((state) => state.tabIndex)
  const vtabIndex = useStore((state) => state.vtabIndex)
  const updateState = useStore((state) => state.updateState)
  return (
    <Columns spacing={3} layout={[9, 3]}>
      <VerticalTabs
        index={vtabIndex}
        labels={LABELS}
        onChange={(index) => {
          updateHelp(camelCase(LABELS[index]))
          updateState({ vtabIndex: index })
        }}
      >
        {tabIndex > 0 ? <LayerChart /> : <Chart />}
        <Channel />
        <Transform />
      </VerticalTabs>
      <EditorHelp helpItem={helpItem} />
    </Columns>
  )
}

function Groups() {
  const tabIndex = useStore((state) => state.tabIndex)
  const updateState = useStore((state) => state.updateState)
  const labels = useStore((state) => state.tabNames)
  const addTab = useStore((state) => state.addLayer)
  const removeTab = useStore((state) => state.removeLayer)
  return (
    <HorizontalTabs
      index={tabIndex}
      labels={labels}
      isDynamic={true}
      onChange={(index) => {
        updateState({ tabIndex: index })
      }}
      onAdd={addTab}
      onRemove={removeTab}
    >
      {labels.map((_, index) => {
        return <Sections key={index} />
      })}
    </HorizontalTabs>
  )
}
