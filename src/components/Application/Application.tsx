import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Content from './Content'
import Header from './Header'
import * as themes from '../../themes'

// TODO: get client/settings?/theme? as props to decouple the component?

export default function Application() {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <CssBaseline />
      <Header />
      <Content />
    </ThemeProvider>
  )
}
