import * as React from 'react'
import Box from '@mui/material/Box'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export default function DialogTabs(props: any) {

  const [currentTabIndex, setCurrentTabIndex] = React.useState(0)

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  // by default the height of the tabs is set by its content, to avoid the height jump
  // when changing the tabs we assign the second tab whatever is the height of the first one
  const tabRefForHeight = React.useRef<HTMLDivElement>(null)

  // the event needs to be passed even if not used, disabling here so there's
  // no unused variable error in the typescript check
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTabIndex(newValue)
  }

  const isWebkitDirectorySupported = 'webkitdirectory' in document.createElement('input')
  if (!isWebkitDirectorySupported) return null

  return (
    <Box>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={currentTabIndex}
            onChange={handleChange}
            aria-label="File Upload Tabs"
            centered
          >
            {props.labels.map((label: string, index: number) => (
                <Tab
                key={label}
                label={label}
                {...a11yProps(index)}
                />
          ))}
          </Tabs>
        </Box>
        {React.Children.map(props.children, (child, index) => (
          <CustomTabPanel value={currentTabIndex} index={index}>
          <Box ref={tabRefForHeight}>
            {child}
          </Box>
        </CustomTabPanel>
        ))}
        
        </Box>
  )
}

function CustomTabPanel(props: {
  children?: React.ReactNode
  index: number
  value: number
}) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}