import * as React from 'react'
import Typography from '@mui/material/Typography'
import Button, { ButtonProps } from '@mui/material/Button'

interface IconButtonProps extends ButtonProps {
  Icon: React.ElementType
  label?: string
  small?: boolean
}

export default function IconButton(props: IconButtonProps) {
  const { Icon, label, small, ...others } = props
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
    </Button>
  )
}
