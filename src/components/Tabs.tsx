import * as React from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'

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

export interface BasicTabsProps {
  state: any
}

export default function BasicTabs(props: BasicTabsProps) {
  const [value, setValue] = React.useState(0)
  const { resource } = props.state

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Resource" {...a11yProps(0)} />
          <Tab label="Detector" {...a11yProps(4)} />
          <Tab label="Dialect" {...a11yProps(2)} />
          <Tab label="Layout" {...a11yProps(3)} />
          <Tab label="Schema" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Box sx={{ mb: 2 }}>
          <TextField
            label="Path"
            variant="outlined"
            defaultValue={resource.path}
            disabled
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Name" defaultValue={resource.name} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Title" defaultValue={resource.title || ''} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Description" defaultValue={resource.description || ''} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Scheme" defaultValue={resource.scheme || ''} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Format" defaultValue={resource.format || ''} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Hashing" defaultValue={resource.hashing || ''} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Encoding" defaultValue={resource.encoding || ''} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Box sx={{ mb: 2 }}>
          <TextField label="Buffer" defaultValue={10000} />
        </Box>
        <Box sx={{ mb: 2 }}>
          <TextField label="Sample" defaultValue={100} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <Box sx={{ mb: 2 }}>
          <TextField label="Delimiter" defaultValue={','} />
        </Box>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Box sx={{ mb: 2 }}>
          <TextField select label="Header" defaultValue={'yes'} sx={{ width: '200px' }}>
            <MenuItem value={'yes'}>Yes</MenuItem>
            <MenuItem value={'no'}>No</MenuItem>
          </TextField>
        </Box>
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Grid container>
          <Grid item xs={6}>
            <Box sx={{ mr: 2, borderRight: 'solid 1px #eee' }}>
              <Box sx={{ mb: 2 }}>
                <TextField label="Name" defaultValue={resource.schema.fields[0].name} />
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField label="Type" defaultValue={resource.schema.fields[0].type} />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={6}>
            {resource.schema.fields.map((field: any, index: any) => (
              <Button
                variant={index === 0 ? 'contained' : 'outlined'}
                key={field.name}
                sx={{ mr: 2 }}
              >
                {field.name}
              </Button>
            ))}
          </Grid>
        </Grid>
      </TabPanel>
    </Box>
  )
}
