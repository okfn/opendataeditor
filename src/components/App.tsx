import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Content from './Content'
import Header from './Header'
import Menu from './Menu'
import * as logic from '../logic'
import * as themes from '../themes'
import * as helpers from '../helpers'

export default function App() {
  // TODO: rebase on useContext
  const [state, dispatch] = helpers.useAsyncReducer(logic.reducer, logic.initialState)

  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <CssBaseline />
      <Header dispatch={dispatch} />
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
          <Grid item xs={9} sx={{ borderLeft: 'dotted 1px #ddd', minHeight: '50vh' }}>
            <Content state={state} />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}
