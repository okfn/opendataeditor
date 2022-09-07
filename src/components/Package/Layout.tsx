import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Actions from './Actions'
import Editor from './Editor'
import Resource from '../Resource'
import Dialect from '../Dialect'
import Schema from '../Schema'
import Checklist from '../Checklist'
import Pipeline from '../Pipeline'
import { useStore } from './store'

// TODO: remove borderTop hack

export default function Layout() {
  const theme = useTheme()
  return (
    <Box sx={{ height: theme.spacing(50) }}>
      <Box sx={{ height: theme.spacing(42) }}>
        <Editor />
      </Box>
      <Box sx={{ height: theme.spacing(8) }}>
        <Actions />
      </Box>
    </Box>
  )
}

export function LayoutWithTabs() {
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const theme = useTheme()
  const update = useStore((state) => state.update)
  const resource = useStore((state) => state.descriptor.resources[0])
  const dialect = useStore((state) => state.descriptor.resources[0]?.dialect)
  const schema = useStore((state) => state.descriptor.resources[0]?.schema)
  const checklist = useStore((state) => state.descriptor.resources[0]?.checklist)
  const pipeline = useStore((state) => state.descriptor.resources[0]?.pipeline)
  return (
    <Box sx={{ width: '100%', height: theme.spacing(56) }}>
      <Box sx={{ height: theme.spacing(6) }}>
        <Tabs
          sx={{ marginTop: '-1px', borderBottom: 1, borderColor: 'divider' }}
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Package" {...a11yProps(0)} />
          <Tab label="Resource" {...a11yProps(1)} />
          <Tab label="Dialect" {...a11yProps(2)} />
          <Tab label="Schema" {...a11yProps(3)} />
          <Tab label="Checklist" {...a11yProps(4)} />
          <Tab label="Pipeline" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Layout />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Resource
          descriptor={resource}
          onCommit={(resource) => update({ resoures: [resource] })}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Dialect
          descriptor={dialect}
          onCommit={(dialect) => update({ resources: [{ ...resource, dialect }] })}
        />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Schema
          descriptor={schema}
          onCommit={(schema) => update({ resources: [{ ...resource, schema }] })}
        />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Checklist
          descriptor={checklist}
          schema={schema}
          onCommit={(checklist) => update({ resources: [{ ...resource, checklist }] })}
        />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <Pipeline
          descriptor={pipeline}
          schema={schema}
          onCommit={(pipeline) => update({ resources: [{ ...resource, pipeline }] })}
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
        <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Typography component="div">{children}</Typography>
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
