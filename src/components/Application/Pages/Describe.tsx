import * as React from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Resource from '../../Resource'
import Strategy from '../../Strategy'
import Dialect from '../../Dialect'
import Schema from '../../Schema'
import { useStore } from '../store'

export default function Describe() {
  const [value, setValue] = React.useState(0)
  const strategy = useStore((state) => state.strategy)
  const resource = useStore((state) => state.resource)
  const updateStrategy = useStore((state) => state.updateStrategy)
  const updateResource = useStore((state) => state.updateResource)
  if (!strategy || !resource) return null
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label="Resource" {...a11yProps(0)} />
          <Tab label="Schema" {...a11yProps(1)} />
          <Tab label="Dialect" {...a11yProps(2)} />
          <Tab label="Strategy" {...a11yProps(3)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Resource
          descriptor={resource}
          onCommit={(resource) => updateResource(resource)}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Schema
          schema={resource.schema}
          onSave={(schema) => updateResource({ schema })}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Dialect
          descriptor={resource.dialect}
          onCommit={(dialect) => updateResource({ dialect })}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Strategy
          descriptor={strategy}
          onCommit={(strategy) => updateStrategy(strategy)}
        />
      </TabPanel>
    </Box>
  )
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
