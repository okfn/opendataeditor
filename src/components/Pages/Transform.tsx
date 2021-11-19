import * as React from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Pipeline from '../Pipeline'
import Status from '../Status'
import { useStore } from '../../store'

export default function Transform() {
  const [value, setValue] = React.useState(0)
  const pipeline = useStore((state) => state.pipeline)
  const status = useStore((state) => state.status)
  const targetRows = useStore((state) => state.targetRows)
  const updatePipeline = useStore((state) => state.updatePipeline)
  if (!pipeline || !status || !targetRows) return null
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={(_, newValue) => setValue(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label="Status" {...a11yProps(0)} />
          <Tab label="Pipeline" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Status schema={status.target.schema} rows={targetRows} />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Pipeline pipeline={pipeline} onSave={(pipeline) => updatePipeline(pipeline)} />
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
