import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Header from './Header'
import FilesView from './Views/Files'
import LinksView from './Views/Links'
import ConfigView from './Views/Config'

export default function Layout() {
  const theme = useTheme()
  const [value, setValue] = React.useState(0)
  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }
  const tabsHeight = `calc(${theme.spacing(6)} - 1px)`
  return (
    <Box sx={{ height: '100vh', overflow: 'hidden' }}>
      <Header />
      <Box sx={{ borderRight: 'solid 1px #ddd' }}>
        <Box sx={{ height: tabsHeight, borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Files" {...a11yProps(0)} />
            <Tab label="Links" {...a11yProps(1)} />
            <Tab label="Config" {...a11yProps(2)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <FilesView />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <LinksView />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <ConfigView />
        </TabPanel>
      </Box>
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
