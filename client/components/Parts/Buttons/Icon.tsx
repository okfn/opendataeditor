import * as React from 'react'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'
import Box from '@mui/material/Box'
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
      fullWidth={!props.small}
      color={props.color}
      startIcon={<Icon fontSize="small" sx={{ mr: !props.small ? 1 : 0 }} />}
      {...others}
    >
      {small ? (
        <Typography sx={{ fontWeight: 300, textTransform: 'capitalize' }}>
          {label}
        </Typography>
      ) : (
        label
      )}
      {extraInfo ? (
        <Box sx={{ padding: '3px 5px', backgroundColor: '#FCF2F2', border: '1px solid #FECBCA', borderRadius: '3px', marginLeft: '5px' }}>
          <Typography sx={{ fontSize: '9px', fontWeight: 300, color: (theme) => theme.palette.OKFNRed500.main  }}>
            {Number(extraInfo) >= 1000 ? '+999' : extraInfo}
          </Typography>
        </Box>
      ) : null}
    </Button>
  )
}
