import * as React from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CardContent from '@mui/material/CardContent'
import iconInfoImg from '../../../assets/icon_info.png'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'

// TODO: review geometry porps/logic

interface HelpCardProps {
  title: string
  subtitle: string
  link: string
  height?: string
  withIcon?: boolean
}

export default function HelpCard(props: React.PropsWithChildren<HelpCardProps>) {
   if(props.withIcon)
   return (<HelpCardWithIcon { ...props } />) 
   else return (<HelpCardNoIcon { ...props } />)

}

export function HelpCardWithIcon(props: React.PropsWithChildren<HelpCardProps>){
  return (
    <Card
      variant="outlined"
      square={true}
      sx={{ height: '100%', border: '1px solid #00D1FF', borderRadius: '8px', marginLeft: '12px', marginRight: '12px', marginBottom: '15px', backgroundColor: '#F5FDFE' }}
    >
      <CardContent sx={{ display: 'flex', 
        padding: '18px !important'
         }}>
        <Box>
            <img src={iconInfoImg} alt="Image Folder Dialog" />
          </Box>
        <Typography variant="body2" sx={{ paddingLeft: '12px', paddingRight: '80px' }}>{props.children}
          <Link href={props.link} target="_blank" underline="none">
            {' '}Learn More
          </Link>
        </Typography>
      </CardContent>
    </Card>
  )
}

export function HelpCardNoIcon(props: React.PropsWithChildren<HelpCardProps>){
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
        <Typography sx={{ mb: 1.5, opacity: 0.5 }} color="text.primary">
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