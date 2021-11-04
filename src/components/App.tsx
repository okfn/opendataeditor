import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Header from './Header'
import Menu from './Menu'
import * as themes from '../themes'

export default function App() {
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
          overflowY: 'scroll',
        }}
      >
        <Grid container>
          <Grid item xs={3}>
            <Menu />
          </Grid>
          <Grid item xs={9} sx={{ borderLeft: 'dotted 1px #ddd', minHeight: '50vh' }}>
            right
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}
