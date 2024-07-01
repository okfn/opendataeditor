import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import * as themes from '../../themes'
import Layout from './Layout'

export default function Application() {
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  )
}
