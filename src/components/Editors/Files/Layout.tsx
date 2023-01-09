import * as React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import Actions from './Actions'
import Content from './Content'
import { Card, CardContent, Typography } from '@mui/material'
import { useStore } from './store'
import { styled } from '@mui/material/styles'
import NoteAddRoundedIcon from '@mui/icons-material/NoteAddRounded'
import MuiAvatar from '@mui/material/Avatar'

export default function Layout() {
  const theme = useTheme()
  const height = `calc(100vh - ${theme.spacing(8 + 6)})`
  const path = useStore((state) => state.path)
  return (
    <Box sx={{ height, display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ height }}>
        {!path ? (
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
        ) : (
          <Content />
        )}
      </Box>
      <Box sx={{ marginTop: 'auto' }}>
        <Actions />
      </Box>
    </Box>
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
