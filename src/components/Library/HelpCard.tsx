import * as React from 'react'
import { useTheme } from '@mui/material/styles'
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
  const theme = useTheme()
  return (
    <Card variant="outlined" sx={{ height: theme.spacing(40) }}>
      <CardContent>
        <Typography
          sx={{ fontSize: 14, marginTop: -0.5, marginBottom: 1 }}
          color="text.secondary"
          gutterBottom
        >
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
