import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import ScrollBox from '../../Parts/ScrollBox'
import ChartEditor from '../../Editors/Chart'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const fields = useStore((state) => state.fields)
  const updateState = useStore((state) => state.updateState)
  return (
    <ScrollBox height={theme.spacing(48)} sx={{ borderTop: 'solid 1px #ddd' }}>
      <ChartEditor fields={fields} onChange={(chart) => updateState({ chart })} />
    </ScrollBox>
  )
}
