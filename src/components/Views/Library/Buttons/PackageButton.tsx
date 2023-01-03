import * as React from 'react'
import Button from '@mui/material/Button'
import FolderIcon from '@mui/icons-material/Folder'

interface PackageButtonProps {
  color?: 'info' | 'warning' | 'secondary'
  disabled?: boolean
  fullWidth?: boolean
  icon?: React.ReactElement
  label: string
  show?: boolean
  marginR?: number
  variant?: 'contained' | 'outlined' | 'text'
  onClick: () => void
}

export default function PackageButton(props: PackageButtonProps) {
  return (
    <React.Fragment>
      <Button
        color={props.color || 'info'}
        disabled={props.disabled}
        variant={props.variant}
        component="label"
        onClick={props.onClick}
        fullWidth={props.fullWidth}
      >
        <FolderIcon sx={{ mr: props.marginR }} fontSize="small" />
        {props.label}
      </Button>
    </React.Fragment>
  )
}
