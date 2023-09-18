import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../Parts/Grids/Columns'
import Action from './Action'
import Content from './Content'
import Dialog from './Dialog'
import Header from './Header'
import Browser from './Browser'
import Menu from './Menu'
import { useStore } from './store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8)})`
  const onStart = useStore((state) => state.onStart)
  React.useEffect(() => {
    onStart().catch(console.error)
  }, [])
  return (
    <React.Fragment>
      <Dialog />
      <Header />
      <Columns layout={[3, 9]}>
        <Box sx={{ height, borderRight: 'solid 1px #ddd' }}>
          <Menu />
          <Box sx={{ height: contentHeight }}>
            <Browser />
          </Box>
          <Action />
        </Box>
        <Content />
      </Columns>
    </React.Fragment>
  )
}
