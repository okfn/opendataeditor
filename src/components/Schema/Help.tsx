import * as React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

export default function Help() {
  return (
    <Card variant="outlined" sx={{ height: 'calc(100% - 8px)' }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Help
        </Typography>
        <Typography variant="h5" component="div">
          Schema
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          overview
        </Typography>
        <Typography variant="body2">
          Table Schema is a specification for providing a schema (similar to a database
          schema) for tabular data. This information includes the expected data type for
          each value in a column, constraints on the value, and the expected format of the
          data.
        </Typography>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Button
          size="small"
          component="a"
          target="_blank"
          href="https://framework.frictionlessdata.io/docs/guides/describing-data#describing-a-schema"
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}
