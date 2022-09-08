import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import DataView from './Views/Data'
import ErrorsView from './Views/Errors'
import MetadataView from './Views/Metadata'
import QueryView from './Views/Query'
import ReportView from './Views/Report'
import SourceView from './Views/Source'

export default function Editor() {
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Data" {...a11yProps(0)} />
          <Tab label="Metadata" {...a11yProps(1)} />
          <Tab label="Report" {...a11yProps(2)} />
          <Tab label="Errors" {...a11yProps(3)} />
          <Tab label="Query" {...a11yProps(4)} />
          <Tab label="Source" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <DataView />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <MetadataView />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReportView />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <ErrorsView />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <QueryView />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <SourceView />
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
        <Box>
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
