import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import TableEditor from '../Editors/Table'
import ReportEditor from '../Editors/Report'
import SourceEditor from '../Editors/Source'
import ChartEditor from '../Editors/Chart'
import SqlEditor from '../Editors/Sql'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const tabsHeight = `calc(${theme.spacing(6)} - 1px)`
  const client = useStore((state) => state.client)
  const record = useStore((state) => state.record)
  if (!record) return null
  return (
    <Box sx={{ borderRight: 'solid 1px #ddd' }}>
      <Box sx={{ height: tabsHeight, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Data" {...a11yProps(0)} />
          <Tab label="Metadata" {...a11yProps(1)} />
          <Tab label="Report" {...a11yProps(2)} />
          <Tab label="Source" {...a11yProps(3)} />
          <Tab label="Chart" {...a11yProps(4)} />
          <Tab label="Sql" {...a11yProps(5)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <TableEditor client={client} record={record} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <TableEditor client={client} record={record} isMetadata={true} />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <ReportEditor client={client} record={record} />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SourceEditor client={client} record={record} />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ChartEditor client={client} />
      </TabPanel>
      <TabPanel value={value} index={5}>
        <SqlEditor client={client} />
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
      <Box>
        <Typography component="div">{children}</Typography>
      </Box>
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }
}
