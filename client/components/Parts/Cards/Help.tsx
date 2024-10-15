import * as React from 'react'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import CardContent from '@mui/material/CardContent'
import iconInfoImg from '../../../assets/icon_info.png'

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
      sx={{ height: '100%', border: '1px solid #00D1FF', borderRadius: '8px' }}
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
