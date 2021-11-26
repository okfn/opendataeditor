import * as React from 'react'
import Grid from '@mui/material/Grid'
import { useStore } from './store'
import ForeignKeys from './ForeignKeys'
import Preview from './Preview'
import General from './General'
import Fields from './Fields'
import Help from './Help'

export default function Editor() {
  const page = useStore((state) => state.page)
  const isPreview = useStore((state) => state.isPreview)
  if (isPreview) return <Preview />
  return (
    <Grid container spacing={3}>
      <Grid item xs={3}>
        <General />
      </Grid>
      <Grid item xs={6}>
        {page === 'fields' ? <Fields /> : <ForeignKeys />}
      </Grid>
      <Grid item xs={3}>
        <Help />
      </Grid>
    </Grid>
  )
}
