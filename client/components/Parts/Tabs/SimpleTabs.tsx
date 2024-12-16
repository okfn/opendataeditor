import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import * as React from 'react'
import { useTranslation } from 'react-i18next'

interface SimpleTabsProps {
  selectedIndex?: number
  disabled? : boolean
  onChange?: (arg0: number) => void
  centered?: boolean,
  labels: Array<string>
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
}

export default function SimpleTabs(props: SimpleTabsProps) {
  
  const { orientation, selectedIndex, disabled, onChange, centered, labels, children} = props

  const [currentTabIndex, setCurrentTabIndex] = React.useState(selectedIndex || 0)

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
    if (!disabled) {
      setCurrentTabIndex(newValue)
      onChange?.(newValue)
    }
    
  }

  const { t } = useTranslation()
  return (
    <Box sx={{ display: orientation === 'vertical' ? 'flex' : '' }}>
      <Box sx={{ borderBottom: orientation === 'vertical' ? 0 : 1, borderColor: 'divider', width: orientation === 'vertical' ? '250px': 'unset', marginTop: orientation === 'vertical' ? '16px' : 0 }}>
        <Tabs
          value={currentTabIndex}
          onChange={handleChange}
          aria-label={t('aria-tabs-component')}
          centered={centered}
          orientation={orientation}
          sx={{
            '& .MuiTabs-indicator': {
              backgroundColor: (theme) => orientation === 'vertical'? 'unset' : theme.palette.OKFNBlue.main,
            },
            '& .MuiButtonBase-root.MuiTab-root': {
              color: (theme) => theme.palette.OKFNGray500.main,
              transition: 'color 0.2s ease-in-out',
              alignItems: orientation === 'vertical' ? 'flex-start' : 'center', 
              '&:hover': {
                opacity: 0.7,
              },
              '&.Mui-selected': {
                color: (theme) => theme.palette.OKFNBlue.main,
              },
            },
          }}
        >
          {labels.map((label: string, index: number) => (
            <Tab
              key={label}
              label={label}
              sx={{ textTransform: 'capitalize' }}
              {...a11yProps(index)}
            />
          ))}
        </Tabs>
      </Box>
      {React.Children.map(children, (child, index) => (
        <CustomTabPanel value={currentTabIndex} index={index} orientation={orientation}>
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
  orientation?: 'horizontal' | 'vertical'
}) {
  const { children, value, orientation, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ width: orientation === 'vertical' ? '720px' : 'unset' }}
    >
      {value === index && <Box sx={{ p: orientation === 'vertical' ? 0: 3 }}>{children}</Box>}
    </div>
  )
}
