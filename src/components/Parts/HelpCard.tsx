import * as React from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'

// TODO: review geometry porps/logic

interface HelpCardProps {
  title: string
  subtitle: string
  link: string
  height?: string
}

export default function HelpCard(props: React.PropsWithChildren<HelpCardProps>) {
  return (
    <Card
      variant="outlined"
      square={true}
      sx={{ height: '100%', border: 0, borderLeft: 'solid 1px #ddd' }}
    >
      <CardContent>
        <Typography
          sx={{ fontSize: 14, marginTop: -0.5, marginBottom: 1 }}
          color="text.primary"
          gutterBottom
        >
          Help
        </Typography>
        <Typography variant="h5" component="div">
          {props.title}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.primary">
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
