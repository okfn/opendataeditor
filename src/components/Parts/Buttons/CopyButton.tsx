import * as React from 'react'
import Button from '@mui/material/Button'

interface CopyButtonProps {
  label: string
  color?: 'info' | 'warning' | 'secondary'
  variant?: 'contained' | 'outlined' | 'text'
  disabled?: boolean
  copyFile: () => void
}

export default function CopyButton(props: CopyButtonProps) {
  return (
    <React.Fragment>
      <Button
        disabled={props.disabled}
        color={props.color}
        variant={props.variant}
        title={props.label}
        onClick={(_: React.SyntheticEvent) => {
          props.copyFile()
        }}
      >
        {props.label}
      </Button>
    </React.Fragment>
  )
}
