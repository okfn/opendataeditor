import * as React from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Report from '../Report'
import Inquiry from '../Inquiry'
import { useStore } from '../../store'

export default function Validate() {
  const [value, setValue] = React.useState(0)
  const inquiry = useStore((state) => state.inquiry)
  const report = useStore((state) => state.report)
  if (!inquiry || !report) return null
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label="Report" {...a11yProps(0)} />
          <Tab label="Inquiry" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Report report={report} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Inquiry inquiry={inquiry} />
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
