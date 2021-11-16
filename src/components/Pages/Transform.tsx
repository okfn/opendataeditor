import * as React from 'react'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Pipeline from '../Pipeline'
import Status from '../Status'
import { IResource } from '../../interfaces/resource'

export interface TransformProps {
  state: any
  dispatch: any
}

export default function Transform(props: TransformProps) {
  const [value, setValue] = React.useState(0)
  const pipeline = props.state.pipeline || {
    tasks: [
      {
        source: { path: 'table.csv' } as IResource,
        steps: [{ code: 'table-normalize', descriptor: '' }],
      },
    ],
  }
  if (!props.state.status) return null
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
        <Status
          schema={props.state.status.tasks[0].target.schema}
          rows={props.state.targetRows}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Pipeline
          pipeline={pipeline}
          onSave={(pipeline) => props.dispatch({ type: 'UPDATE_PIPELINE', pipeline })}
        />
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
