import { createTheme, SimplePaletteColorOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface CustomPalette {
    OKFNCoolGray: SimplePaletteColorOptions
    OKFNCoolGray400: SimplePaletteColorOptions
    OKFNGray500: SimplePaletteColorOptions
    OKFNBlue: SimplePaletteColorOptions
    OKFNRed: SimplePaletteColorOptions
    OKFNGreenBlue: SimplePaletteColorOptions
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    OKFNCoolGray: true
    OKFNGray500: true
    OKFNCoolGray400: true
    OKFNBlue: true
    OKFNRed: true
    OKFNGreenBlue: true
  }
}

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
    // LightGray
    OKFNCoolGray: {
      main: '#4C5564',
    },
    OKFNGray500: {
      main: '#717879',
    },
    OKFNCoolGray400: {
      main: '#9CA2AE',
    },
    // OKFN Blue
    OKFNBlue: {
      main: '#00D1FF',
    },
    OKFNRed: {
      main: '#FF403F',
    },
    OKFNGreenBlue: {
      main: '#56C4A3',
    },
  },
})
