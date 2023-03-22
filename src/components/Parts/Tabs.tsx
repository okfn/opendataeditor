import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiTabs from '@mui/material/Tabs'
import MuiTab from '@mui/material/Tab'

export interface TabsProps {
  index?: number
  labels: string[]
  disabledLabels?: string[]
  children?: React.ReactNode
  onChange?: (index: number) => void
}

export default function Tabs(props: TabsProps) {
  const theme = useTheme()
  let [value, setValue] = React.useState(props.index || 0)
  // TODO: it's a hack; rebase on normal controlled/uncontrolled
  if (props.index !== undefined) value = props.index
  const handleChange = (_: any, newValue: number) => {
    setValue(newValue)
    props.onChange && props.onChange(newValue)
  }
  const tabsHeight = `calc(${theme.spacing(6)} - 1px)`
  return (
    <Box>
      <Box sx={{ height: tabsHeight, borderBottom: 1, borderColor: 'divider' }}>
        <MuiTabs value={value} onChange={handleChange}>
          {props.labels.map((label) => (
            <MuiTab
              key={label}
              label={label.replace('_', '')}
              disabled={
                label.startsWith('_') || (props.disabledLabels || []).includes(label)
              }
            />
          ))}
        </MuiTabs>
      </Box>
      <Box>
        {React.Children.map(props.children, (child, index) => (
          <div key={index} role="tabpanel" hidden={value !== index}>
            {child}
          </div>
        ))}
      </Box>
    </Box>
  )
}
