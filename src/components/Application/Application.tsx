import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Header from './Header'
import Page from './Page'
import Menu from './Menu'
import * as themes from '../../themes'

// TODO: get client/settings?/theme? as props to decouple the component

export default function Application() {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <CssBaseline />
      <Header />
      <Box
        sx={{
          height: 'calc(100% - 72px)',
          position: 'fixed',
          top: 72,
          width: '100%',
          overflowY: 'auto',
        }}
      >
        <Grid container>
          <Grid item xs={3}>
            <Menu />
          </Grid>
          <Grid item xs={9} sx={{ borderLeft: 'solid 1px #eee', minHeight: '50vh' }}>
            <Page />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}
