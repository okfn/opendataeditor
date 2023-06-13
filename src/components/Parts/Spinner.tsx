import * as React from 'react'
import { styled } from '@mui/material/styles'
import CardContent from '@mui/material/CardContent'
import Card from '@mui/material/Card'
import CircularProgress from '@mui/material/CircularProgress'

export interface SpinnerProps {
  message?: string
}

export default function Spinner(props: SpinnerProps) {
  return (
    <StyledCard>
      <StyledCardContent>
        <CircularProgress />
        {props.message || 'Please wait'}...
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
  zIndex: 1000000,
}))

const StyledCardContent = styled(CardContent)(() => ({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  fontSize: '16px',
  color: '#777',
  zIndex: 1000000,
}))
