import * as React from 'react'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import Detector from '../../Detector'
import { useStore } from '../store'

export default function Conig() {
  const [value, setValue] = React.useState(0)
  const detector = useStore((state) => state.detector)
  const updateDetector = useStore((state) => state.updateDetector)
  // TODO: add detector to initial state
  if (!detector) return null
  return (
    <Columns spacing={3} layout={[3, 9]}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={(_, newValue) => setValue(newValue)}
        aria-label="Vertical tabs example"
        sx={{
          // height: '100%',
          borderRight: 1,
          borderColor: 'divider',
          '& .MuiButtonBase-root': { alignItems: 'flex-start' },
        }}
      >
        <Tab label="Detector" {...a11yProps(0)} />
        <Tab label="Import" {...a11yProps(1)} />
        <Tab label="Export" {...a11yProps(2)} />
        <Tab label="Theme" {...a11yProps(3)} />
      </Tabs>
      <React.Fragment>
        <TabPanel value={value} index={0}>
          <Detector
            descriptor={detector}
            onCommit={(detector) => updateDetector(detector)}
          />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <div>Under development</div>
        </TabPanel>
        <TabPanel value={value} index={2}>
          <div>Under development</div>
        </TabPanel>
        <TabPanel value={value} index={3}>
          <div>Under development</div>
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
