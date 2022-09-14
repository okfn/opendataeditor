import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { StoreProvider, createStore } from './store'

function Tab1(props: { name?: string }) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return <StoreProvider value={store}>Tab1</StoreProvider>
}

function Tab2(props: { name?: string }) {
  const store = React.useMemo(() => createStore(props), Object.values(props))
  return <StoreProvider value={store}>Tab1</StoreProvider>
}

interface TestProps {}

export default function Stores(_props: TestProps) {
  return <Layout />
}

function Layout() {
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const theme = useTheme()
  const tabsHeight = `calc(${theme.spacing(6)} - 1px)`
  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ height: tabsHeight, borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Tab1" {...a11yProps(0)} />
          <Tab label="Tab2" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Tab1 name="tab1" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Tab2 name="tab2" />
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
