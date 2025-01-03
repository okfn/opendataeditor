import { createTheme, SimplePaletteColorOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface CustomPalette {
    OKFNCoolGray: SimplePaletteColorOptions
    OKFNCoolGray400: SimplePaletteColorOptions
    OKFNGray100: SimplePaletteColorOptions
    OKFNGray500: SimplePaletteColorOptions
    OKFNBlue: SimplePaletteColorOptions
    OKFNRed400: SimplePaletteColorOptions
    OKFNRed500: SimplePaletteColorOptions
    OKFNRed600: SimplePaletteColorOptions
    OKFNGreenBlue: SimplePaletteColorOptions
    OKFNBlack: SimplePaletteColorOptions
    OKFNWhite: SimplePaletteColorOptions
    OKFNGray700: SimplePaletteColorOptions
  }
  interface Palette extends CustomPalette {}
  interface PaletteOptions extends CustomPalette {}
}

declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    OKFNCoolGray: true
    OKFNGray100: true
    OKFNGray500: true
    OKFNCoolGray400: true
    OKFNBlue: true
    OKFNRed400: true
    OKFNRed500: true
    OKFNRed600: true
    OKFNGreenBlue: true
    OKFNBlack: true
    OKFNWhite: true
    OKFNGray700: true
  }
}
declare module './components/Parts/Icons/DeleteIcon' {
  interface SvgIconPropsColorOverrides {
    OKFNRed500: true
    OKFNGray700: true
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
    OKFNGray100: {
      main: '#F4F4F4',
    },
    OKFNGray500: {
      main: '#717879',
    },
    OKFNCoolGray400: {
      main: '#9CA2AE',
    },
    OKFNGray700: {
      main: '#3F4345',
    },
    // OKFN Blue
    OKFNBlue: {
      main: '#00D1FF',
    },
    OKFNRed400: {
      main: '#FF7170',
    },
    OKFNRed500: {
      main: '#FF403F',
    },
    OKFNRed600: {
      main: '#DC2625',
    },
    OKFNGreenBlue: {
      main: '#56C4A3',
    },
    OKFNBlack: {
      main: '#000000',
    },
    OKFNWhite: {
      main: '#FFFFFF',
    },
  },
})
