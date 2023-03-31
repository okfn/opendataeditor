import * as React from 'react'
import Button, { ButtonProps } from '@mui/material/Button'

interface IconButtonProps extends ButtonProps {
  label: string
  Icon: React.ElementType
}

export default function IconButton(props: IconButtonProps) {
  return (
    <Button fullWidth color={props.color || 'info'} {...props}>
      <props.Icon fontSize="small" sx={{ mr: 1 }} /> {props.label}
    </Button>
  )
}
