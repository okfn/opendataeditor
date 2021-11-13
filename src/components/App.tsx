import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Header from './Header'
import Page from './Page'
import Menu from './Menu'
import * as logic from '../logic'
import * as themes from '../themes'
import * as helpers from '../helpers'

// TODO: move export/preview to the right column as a vertical tabs
// TODO: add YAML export/preview

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
            <Menu state={state} dispatch={dispatch} />
          </Grid>
          <Grid item xs={9} sx={{ borderLeft: 'solid 1px #eee', minHeight: '50vh' }}>
            <Page state={state} dispatch={dispatch} />
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  )
}
