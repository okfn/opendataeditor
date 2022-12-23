import * as React from 'react'
import Card from '@mui/material/Card'
import { Grid, Link } from '@mui/material'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'

interface ContributorsItemProps {
  title: string
  id: string
  email?: string
  path?: string
  role?: string
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
}
export default function ContributorsItem({
  title,
  id,
  email,
  path,
  role,
  onDelete,
}: ContributorsItemProps) {
  return (
    <Grid item xs={6}>
      <Card variant="outlined" sx={{ minWidth: 275, position: 'relative' }}>
        <CardContent>
          <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {role}
          </Typography>
          <Typography variant="h5" component="div">
            {title}
          </Typography>
          <Typography
            sx={{ marginTop: '1em', fontSize: 14, color: 'rgb(0,0,0)' }}
            gutterBottom
          >
            <Link
              target="_blank"
              variant="inherit"
              href={`mailto: ${email}`}
              underline="none"
            >
              {email}
            </Link>
          </Typography>
          <Typography sx={{ fontSize: 14, color: 'rgb(0,0,0)' }} gutterBottom>
            <Link target="_blank" variant="inherit" href={path} underline="none">
              {path}
            </Link>
          </Typography>
        </CardContent>
        <CardActions>
          <ModeEditOutlineOutlinedIcon
            color="primary"
            sx={{
              position: 'absolute',
              top: '16px',
              right: '40px',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&: hover': { opacity: 0.7 },
            }}
            onClick={() => console.log('open edit modal')}
          />
        </CardActions>
        <CardActions>
          <DeleteOutlineOutlinedIcon
            color="primary"
            sx={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              fontSize: '20px',
              cursor: 'pointer',
              transition: 'all 0.3s',
              '&: hover': { opacity: 0.7 },
            }}
            onClick={() => onDelete(id)}
          />
        </CardActions>
      </Card>
    </Grid>
  )
}
