import * as React from 'react'
import Box from '@mui/material/Box'
import publishDialogImg from '../../Application/Dialogs/assets/dialog_publish.png'
import EditorHelp from '../Base/Help'
import CkanSection from './Sections/Ckan'
import GithubSection from './Sections/Github'
import ZenodoSection from './Sections/Zenodo'
import { useStore } from './store'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

export default function Layout() {
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const [value, setValue] = React.useState(0)

  // the event needs to be passed even if not used, disabling here so there's
  // no unused variable error in the typescript check
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  const helpItem = useStore((state) => state.helpItem)
  return (
    <Box sx={{ height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          paddingTop: '70px',
          paddingBottom: '30px',
        }}
      >
        <img src={publishDialogImg} alt="Image Publish Dialog" />
      </Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="File Upload Tabs"
          centered
        >
          <Tab label="Ckan" {...a11yProps(0)} />
          <Tab label="Github" {...a11yProps(1)} />
          <Tab label="Zenodo" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <EditorHelp helpItem={helpItem} />
        <CkanSection />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <EditorHelp helpItem={helpItem} />
        <GithubSection />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <EditorHelp helpItem={helpItem} />
        <ZenodoSection />
      </CustomTabPanel>
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
