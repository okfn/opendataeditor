import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import IosShareIcon from '@mui/icons-material/IosShare'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CheckIcon from '@mui/icons-material/Check'
import HistoryIcon from '@mui/icons-material/History'
import IconButton from '../../Parts/Buttons/Icon'
import Columns from '../../Parts/Columns'

export interface ActionBarProps {}

export function ActionBar(props: React.PropsWithChildren<ActionBarProps>) {
  return (
    <Toolbar
      disableGutters
      sx={{ borderTop: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2 }}
    >
      <ActionBarItems {...props} />
    </Toolbar>
  )
}

function ActionBarItems(props: React.PropsWithChildren<ActionBarProps>) {
  return <Columns spacing={2}>{props.children}</Columns>
}

export interface ButtonProps {
  label?: string
  color?: 'success' | 'warning' | 'error' | 'info'
  disabled?: boolean
  updated?: boolean
  onClick?: () => void
}

export function SaveAsButton(props: ButtonProps) {
  return (
    <IconButton
      label={props.label || 'Save As'}
      Icon={SaveAltIcon}
      variant="outlined"
      disabled={props.disabled}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      sx={{ backgroundColor: 'white' }}
    />
  )
}

export function PublishButton(props: ButtonProps) {
  return (
    <IconButton
      label={props.label || 'Publish'}
      Icon={IosShareIcon}
      variant="outlined"
      disabled={props.disabled}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      sx={{ backgroundColor: 'white' }}
    />
  )
}

export function RevertButton(props: ButtonProps) {
  return (
    <IconButton
      label={props.label || 'Revert'}
      Icon={HistoryIcon}
      color={props.updated ? 'warning' : undefined}
      variant={props.updated ? 'contained' : 'outlined'}
      disabled={props.disabled || !props.updated}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      sx={{ backgroundColor: !props.updated ? 'white' : undefined }}
    />
  )
}

export function SaveButton(props: ButtonProps) {
  return (
    <IconButton
      label={props.label || 'Save'}
      Icon={CheckIcon}
      variant={props.updated ? 'contained' : 'outlined'}
      disabled={props.disabled || !props.updated}
      onClick={() => (props.onClick ? props.onClick() : undefined)}
      sx={{ backgroundColor: !props.updated ? 'white' : undefined }}
    />
  )
}
