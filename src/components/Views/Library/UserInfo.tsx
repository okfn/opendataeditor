import * as React from 'react'
import Box from '@mui/material/Box'
import { styled } from '@mui/material/styles'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'
import { useTheme } from '@mui/material/styles'

interface UserInfoProps {
  message: string
  type: string
  showIcon?: boolean
}

export default function UserInfo(props: UserInfoProps) {
  const theme = useTheme()
  return (
    <React.Fragment>
      {props.type === 'success' ? (
        <InfoBox component="div">
          {props.showIcon && <CheckCircleIcon color="success" fontSize="small" />}
          {props.message}
        </InfoBox>
      ) : (
        <InfoBox component="div" color={theme.palette.error.main}>
          {props.showIcon && <ErrorIcon color="error" fontSize="small" />} {props.message}
        </InfoBox>
      )}
    </React.Fragment>
  )
}

const InfoBox = styled(Box)<{ color?: string }>(({ color }) => ({
  display: 'flex',
  color,
  alignItems: 'center',
  paddingLeft: '14px',
  fontSize: '.7rem',
  '& .MuiSvgIcon-root': {
    mr: 1,
  },
}))
