import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import CheckIcon from '@mui/icons-material/Check'
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt'
import HistoryIcon from '@mui/icons-material/History'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import noop from 'lodash/noop'
import * as React from 'react'
import IconButton from '../../Parts/Buttons/Icon'
import Columns from '../Grids/Columns'

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
  updated?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function SaveAsButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  return (
    <Box>
      <IconButton
        label={props.label || 'Save Changes'}
        Icon={SaveAltIcon}
        variant="outlined"
        disabled={props.disabled}
        onClick={() => onClick()}
        sx={{
          backgroundColor: 'white',
          color: (theme) => theme.palette.OKFNCoolGray.main,
          borderColor: (theme) => theme.palette.OKFNCoolGray.main,
          '&:hover': {
            borderColor: (theme) => theme.palette.OKFNCoolGray.main,
          },
        }}
      />
    </Box>
  )
}

export function AssistantButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  return (
    <Box sx={{ marginRight: '20px' }}>
      <IconButton
        label={props.label || 'AI'}
        Icon={AutoFixHighIcon}
        variant="outlined"
        disabled={props.disabled}
        onClick={() => onClick()}
        sx={{
          backgroundColor: 'white',
          textTransform: 'none',
          color: (theme) => theme.palette.OKFNCoolGray.main,
          borderColor: (theme) => theme.palette.OKFNCoolGray.main,
          '&:hover': {
            borderColor: (theme) => theme.palette.OKFNCoolGray.main,
          },
        }}
      />
    </Box>
  )
}

export function PublishButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  return (
    <Box sx={{ marginRight: '20px' }}>
      <IconButton
        label={props.label || 'Publish'}
        Icon={ElectricBoltIcon}
        variant="outlined"
        disabled={props.disabled}
        onClick={() => onClick()}
        sx={{
          backgroundColor: 'white',
          textTransform: 'none',
          color: (theme) => theme.palette.OKFNCoolGray.main,
          borderColor: (theme) => theme.palette.OKFNCoolGray.main,
          '&:hover': {
            borderColor: (theme) => theme.palette.OKFNCoolGray.main,
          },
        }}
      />
    </Box>
  )
}

export function RevertButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  return (
    <Box>
      <IconButton
        label={props.label || 'Revert'}
        Icon={HistoryIcon}
        color={props.updated ? 'warning' : undefined}
        variant={props.updated ? 'contained' : 'outlined'}
        disabled={!props.updated}
        onClick={() => onClick()}
        sx={{ backgroundColor: !props.updated ? 'white' : undefined }}
      />
    </Box>
  )
}

export function SaveButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  return (
    <Box>
      <IconButton
        label={props.label || 'Save changes'}
        Icon={CheckIcon}
        variant={props.updated ? 'contained' : 'outlined'}
        disabled={!props.updated}
        onClick={() => onClick()}
        sx={{
          backgroundColor: !props.updated ? 'white' : undefined,
          textTransform: 'none',
        }}
      />
    </Box>
  )
}
