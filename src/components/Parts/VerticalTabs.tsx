import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

export interface VerticalTabsProps {
  index?: number
  labels: string[]
  children?: React.ReactNode
  onChange?: (index: number) => void
}

export default function VerticalTabs(props: VerticalTabsProps) {
  const [value, setValue] = React.useState(props.index || 0)
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
    if (props.onChange) {
      props.onChange(newValue)
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.paper', display: 'flex', height: '100%' }}>
      <Tabs
        orientation="vertical"
        // variant="scrollable"
        value={value}
        onChange={handleChange}
        aria-label="Package Tabs"
        sx={{ borderRight: 1, borderColor: 'divider', paddingTop: 2, height: '100%' }}
      >
        {props.labels.map((label, index) => (
          <Tab key={label} label={label} {...a11yProps(index)} />
        ))}
      </Tabs>
      {React.Children.map(props.children, (child, index) => (
        <TabPanel value={value} index={index}>
          {child}
        </TabPanel>
      ))}
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
  const theme = useTheme()
  const width = `calc(100% - ${theme.spacing(10)})`
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
      style={{ width, height: '100%' }}
    >
      {value === index && <Box sx={{ paddingLeft: 3 }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  }
}
