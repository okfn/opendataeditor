import * as React from 'react'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { assert } from 'ts-essentials'
import Columns from '../../Library/Columns'
import Resource from '../../Resource'
import Dialect from '../../Dialect'
import Schema from '../../Schema'
import Query from '../../Query'
// import Inquiry from '../../Inquiry'
// import Pipeline from '../../Pipeline'
import { useStore } from '../store'

export default function Metadata() {
  const [value, setValue] = React.useState(0)
  const resource = useStore((state) => state.resource)
  const query = useStore((state) => state.query)
  const inquiry = useStore((state) => state.inquiry)
  const pipeline = useStore((state) => state.pipeline)
  const updateResource = useStore((state) => state.updateResource)
  const updateQuery = useStore((state) => state.updateQuery)
  // const updateInquiry = useStore((state) => state.updateInquiry)
  // const updatePipeline = useStore((state) => state.updatePipeline)
  assert(resource)
  assert(query)
  assert(inquiry)
  assert(pipeline)
  return (
    <Columns spacing={3} layout={[3, 9]}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="Vertical tabs example"
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          '& .MuiButtonBase-root': { alignItems: 'flex-start' },
        }}
      >
        <Tab label="Resource" {...a11yProps(0)} />
        <Tab label="Dialect" {...a11yProps(1)} />
        <Tab label="Schema" {...a11yProps(2)} />
        <Tab label="Query" {...a11yProps(3)} />
        <Tab label="Inqiury" {...a11yProps(3)} />
        <Tab label="Pipeline" {...a11yProps(4)} />
      </Tabs>
      <React.Fragment>
        <TabPanel value={value} index={0}>
          <Resource
            descriptor={resource}
            onCommit={(resource) => updateResource(resource)}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <Dialect
            descriptor={resource.dialect}
            onCommit={(dialect) => updateResource({ dialect })}
          />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Schema
            descriptor={resource.schema}
            onCommit={(schema) => updateResource({ schema })}
          />
        </TabPanel>
        <TabPanel value={value} index={3}>
          <Query
            descriptor={query}
            schema={resource.schema}
            onCommit={(query) => updateQuery(query)}
          />
        </TabPanel>
        <TabPanel value={value} index={4}>
          Under development
        </TabPanel>
        <TabPanel value={value} index={5}>
          Under development
        </TabPanel>
      </React.Fragment>
    </Columns>
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
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}
