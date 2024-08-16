import * as React from 'react'
import { useTheme } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Columns from '../Parts/Grids/Columns'
import Action from './Action'
import Content from './Content'
import Dialog from './Dialog'
import Error from './Error'
import Browser from './Browser'
import * as store from '@client/store'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8)})`
  const contentHeight = `calc(100vh - ${theme.spacing(8 + 8 + 8)})`

  React.useEffect(() => {
    store.onAppStart().catch(console.error)
  }, [])

  store.openDialog('welcomeBanner')

  return (
    <React.Fragment>
      <Error />
      <Dialog />
      <Columns layout={[3, 9]}>
        <Box sx={{ height, borderRight: 'solid 1px #ddd', width: '284px' }}>
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
