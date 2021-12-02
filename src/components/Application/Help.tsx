import * as React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Columns from '../Library/Columns'

export default function Help() {
  return (
    <Columns spacing={3} layout={[3, 9]}>
      <Navigation />
      <Document />
    </Columns>
  )
}

function Navigation() {
  return null
}

function Document() {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Help
        </Typography>
        <Typography variant="h5" component="div">
          Frictionless Application
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          overview
        </Typography>
        <Typography variant="body2">
          Frictionless is a framework to describe, extract, validate, and transform
          tabular data in Python.
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small">Learn More</Button>
      </CardActions>
    </Card>
  )
}
