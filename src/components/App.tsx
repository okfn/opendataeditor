import React from 'react'
import { createTheme, ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Grid from '@material-ui/core/Grid'
import Header from './Header'

// General

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <div
        style={{
          height: 'calc(100% - 72px)',
          position: 'fixed',
          top: 72,
          width: '100%',
          overflowY: 'scroll',
        }}
      >
        <Grid container>
          <Grid item xs={3}>
            left
          </Grid>
          <Grid item xs={9} style={{ borderLeft: 'dotted 1px #ddd', minHeight: '50vh' }}>
            right
          </Grid>
        </Grid>
      </div>
    </ThemeProvider>
  )
}

// Styles

const theme = createTheme({
  palette: {
    primary: {
      main: '#3577D2',
    },
    secondary: {
      main: '#689f38',
    },
    background: {
      default: '#ffffff',
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '::-webkit-scrollbar': {
          width: 12,
        },
        '::-webkit-scrollbar-track': {
          background: '#f4f4f4',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#ddd',
        },
        '::-webkit-scrollbar-thumb:hover': {
          background: '#bbb',
        },
      },
    },
  },
})
