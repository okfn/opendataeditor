import * as React from 'react'
import { assert } from 'ts-essentials'
import Typography from '@mui/material/Typography'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import Columns from '../../Library/Columns'
import Report from '../../Report'
import Table from '../../Table'
import File from '../../File'
import { useStore } from '../store'

export default function Data() {
  const [value, setValue] = React.useState(0)
  const resource = useStore((state) => state.resource)
  const rows = useStore((state) => state.rows)
  const text = useStore((state) => state.text)
  const report = useStore((state) => state.report)
  assert(resource)
  assert(rows)
  // TODO: text might not be available while it will be still correct state
  assert(text)
  assert(report)
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
        <Tab label="Table" {...a11yProps(0)} />
        <Tab label="Source" {...a11yProps(1)} />
        <Tab label="Report" {...a11yProps(2)} />
      </Tabs>
      <React.Fragment>
        <TabPanel value={value} index={0}>
          <Table schema={resource.schema} rows={rows} />
        </TabPanel>
        <TabPanel value={value} index={1}>
          return <File text={text} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Report report={report} />
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
