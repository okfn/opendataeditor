import * as React from 'react'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

// TODO: remove height

interface HelpCardProps {
  title: string
  subtitle: string
  height: string
  link: string
}

export default function HelpCard(props: React.PropsWithChildren<HelpCardProps>) {
  return (
    <Card variant="outlined" sx={{ height: props.height }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Help
        </Typography>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {props.subtitle}
        </Typography>
        <Typography variant="body2">{props.children}</Typography>
      </CardContent>
      <CardActions sx={{ pt: 0 }}>
        <Button size="small" component="a" target="_blank" href={props.link}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}
