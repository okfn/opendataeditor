import * as React from 'react'
import Grid from '@mui/material/Grid'
import HeadingBox from '../../Library/Groups/HeadingBox'

export default function General() {
  return (
    <>
      <HeadingBox>General</HeadingBox>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <h2>Hello</h2>
        </Grid>
        <Grid item xs={6}>
          <h2>Hello</h2>
        </Grid>
        <Grid item xs={6}>
          <h2>Hello</h2>
        </Grid>
        <Grid item xs={6}>
          <h2>Hello</h2>
        </Grid>
        <Grid item xs={6}>
          <h2>Hello</h2>
        </Grid>
      </Grid>
      <h2>Hello</h2>
    </>
  )
}
