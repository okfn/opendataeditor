import * as React from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import MuiAvatar from '@mui/material/Avatar'
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded'

export default function Empty() {
  return (
    <StyledCard>
      <StyledCardContent>
        <StyledMuiAvatar>
          <NoteAddRoundedIcon />
        </StyledMuiAvatar>
        <Typography sx={{ fontWeight: 600 }}>No resources found.</Typography>
        <Typography sx={{ fontWeight: 300 }}>
          Use{' '}
          <Typography component="span" sx={{ color: '#3577D2' }}>
            &quot;+ New&quot;{' '}
          </Typography>{' '}
          to upload files.
        </Typography>
      </StyledCardContent>
    </StyledCard>
  )
}

const StyledCard = styled(Card)(() => ({
  width: '100%',
  height: '100%',
  border: 'none',
  boxShadow: 'none',
  borderRadius: 0,
  square: 'true',
  display: 'flex',
  alignItems: 'center',
}))

const StyledCardContent = styled(CardContent)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
}))

const StyledMuiAvatar = styled(MuiAvatar)(({ theme }) => ({
  height: theme.spacing(8),
  width: theme.spacing(8),
  '& .MuiSvgIcon-root': {
    fontSize: 50,
    color: '#3577D2',
  },
}))
