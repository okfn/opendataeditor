import Box from '@mui/material/Box'
import Button, { ButtonProps } from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import * as React from 'react'
interface IconButtonProps extends ButtonProps {
  Icon: React.ElementType
  label?: string
  small?: boolean
  extraInfo?: string | number
}

export default function IconButton(props: IconButtonProps) {
  const { Icon, label, small, extraInfo, ...others } = props

  return (
    <Button
      sx={{ whiteSpace: 'nowrap' }}
      fullWidth={!props.small}
      color={props.color}
      startIcon={<Icon fontSize="small" sx={{ mr: !props.small ? 1 : 0 }} />}
      {...others}
    >
      {small ? (
        <Typography
          sx={{ fontWeight: 300, textTransform: 'capitalize', whiteSpace: 'nowrap' }}
        >
          {label}
        </Typography>
      ) : (
        <Typography sx={{ whiteSpace: 'nowrap' }}>{label}</Typography>
      )}
      {extraInfo ? (
        <Box
          sx={{
            padding: '3px 5px',
            backgroundColor: '#FCF2F2',
            border: '1px solid #FECBCA',
            borderRadius: '3px',
            marginLeft: '5px',
          }}
        >
          <Typography
            sx={{
              fontSize: '9px',
              fontWeight: 300,
              color: (theme) => theme.palette.OKFNRed500.main,
            }}
          >
            {Number(extraInfo) >= 1000 ? '+999' : extraInfo}
          </Typography>
        </Box>
      ) : null}
    </Button>
  )
}
