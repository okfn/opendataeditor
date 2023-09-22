import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

interface CardButtonProps {
  label: string
  text: string
  link: string
  onClick: () => void
}

export default function CardButton(props: CardButtonProps) {
  return (
    <Card
      variant="outlined"
      sx={{ width: '100%', height: '100%', border: 'dashed 1px #489be6' }}
    >
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {props.label}
        </Typography>
        <Typography variant="body2" color="text.primary">
          {props.text}
        </Typography>
      </CardContent>
      <CardActions>
        <Button onClick={() => props.onClick()}>Open Editor</Button>
        <Button target="_blank" href={props.link}>
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}
