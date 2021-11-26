import * as React from 'react'
import Grid from '@mui/material/Grid'
import { useStore } from './store'
import Preview from './Preview'
import General from './General'
import Page from './Page'
import Help from './Help'

export default function Editor() {
  const isPreview = useStore((state) => state.isPreview)
  if (isPreview) return <Preview />
  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={6}>
        <Page />
      </Grid>
      <Grid item xs={3}>
        <Help />
      </Grid>
    </Grid>
  )
}
