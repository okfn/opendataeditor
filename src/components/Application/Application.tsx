import * as React from 'react'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import Layout from './Layout'
import * as themes from '../../themes'
import { useStore } from './store'

// TODO: get client/settings?/theme? as props to decouple the component?

export default function Application() {
  const session = useStore((state) => state.session)
  const ensureProject = useStore((state) => state.ensureProject)
  React.useEffect(() => {
    ensureProject().catch(console.error)
  }, [])
  if (!session) return null
  return (
    <ThemeProvider theme={themes.DEFAULT}>
      <CssBaseline />
      <Layout />
    </ThemeProvider>
  )
}
