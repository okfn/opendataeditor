import * as React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Columns from '../../Library/Columns'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'

export default function Help() {
  const [value, setValue] = React.useState(0)
  return (
    <Box sx={{ padding: 2 }}>
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
          <Tab label="Introduction" {...a11yProps(0)} />
          <Tab label="Getting Started" {...a11yProps(1)} />
          <Tab label="Describe Data" {...a11yProps(2)} />
          <Tab label="Extract Data" {...a11yProps(3)} />
          <Tab label="Validate Data" {...a11yProps(4)} />
          <Tab label="Transform Data" {...a11yProps(5)} />
        </Tabs>
        <React.Fragment>
          <TabPanel value={value} index={0}>
            <Introduction />
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
          <TabPanel value={value} index={4}>
            <div>Under development</div>
          </TabPanel>
          <TabPanel value={value} index={5}>
            <div>Under development</div>
          </TabPanel>
        </React.Fragment>
      </Columns>
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

function Introduction() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Help
        </Typography>
        <Typography variant="h5" component="div">
          Frictionless Application
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          overview
        </Typography>
        <Typography variant="body2">
          Frictionless is a framework to describe, extract, validate, and transform
          tabular data in Python.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}
