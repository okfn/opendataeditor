import { createTheme } from '@mui/material/styles'

export const DEFAULT = createTheme({
  typography: {
    fontFamily: ['"Hanken Grotesk Variable"', 'sans-serif'].join(','),
  },
  palette: {
    // Blue 1
    primary: {
      main: '#0288d1',
    },
    // Blue 2
    secondary: {
      main: '#3577D2',
    },
    // Blue 3
    info: {
      main: '#9c27b0',
    },
    // Green
    success: {
      main: '#37963c',
    },
    // Red
    error: {
      main: '#d32f2f',
    },
    // Yellow
    warning: {
      main: '#ed6c02',
    },
  },
})
