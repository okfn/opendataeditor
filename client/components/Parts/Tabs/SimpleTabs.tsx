import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface SimpleTabsProps {
  selectedIndex?: number
  disabled? : boolean
  onChange?: () => void
  centered?: boolean,
  labels: Array<string>
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export default function SimpleTabs(props: SimpleTabsProps) {
  const [currentTabIndex, setCurrentTabIndex] = React.useState(props.selectedIndex || 0)

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  // the event needs to be passed even if not used, disabling here so there's
  // no unused variable error in the typescript check
  // @ts-ignore
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    if (!props.disabled) {
      setCurrentTabIndex(newValue)
      props.onChange?.()
    }
  }

  const { t } = useTranslation()
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleChange}
          aria-label={t('aria-tabs-compoment')}
          centered={props.centered}
          orientation={props.orientation}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: (theme) => theme.palette.OKFNBlue.main,
            },
            '& .MuiButtonBase-root.MuiTab-root': {
              color: (theme) => theme.palette.OKFNGray500.main,
              transition: 'color 0.2s ease-in-out',
              '&:hover': {
                opacity: 0.7,
              },
              '&.Mui-selected': {
                color: (theme) => theme.palette.OKFNBlue.main,
              },
            },
          }}
        >
          {props.labels.map((label: string, index: number) => (
            <Tab
              key={label}
              label={label}
              sx={{ textTransform: 'capitalize' }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {React.Children.map(props.children, (child, index) => (
        <CustomTabPanel value={currentTabIndex} index={index}>
          <Box>{child}</Box>
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
