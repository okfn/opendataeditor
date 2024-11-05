import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import RuleIcon from '@mui/icons-material/Rule'
import CompressIcon from '@mui/icons-material/Compress'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HandymanIcon from '@mui/icons-material/Handyman'
import CodeIcon from '@mui/icons-material/Code'
import TuneIcon from '@mui/icons-material/Tune'
import IconButton from '../Buttons/Icon'
import { useTheme } from '@mui/material/styles'
import { useKeyPress } from 'ahooks'

export interface MenuBarProps {
  fullWidth?: boolean
}

export function MenuBar(props: React.PropsWithChildren<MenuBarProps>) {
  return (
    <Toolbar
      disableGutters
      sx={{ borderBottom: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2, width: '100%'}}
    >
      <MenuBarItems {...props} />
    </Toolbar>
  )
}

function MenuBarItems(props: React.PropsWithChildren<MenuBarProps>) {
  if (props.fullWidth) return <React.Fragment>{props.children}</React.Fragment>
  return (
    <Stack direction="row" sx={{ width: '100%' }} spacing={1}>
      {props.children}
    </Stack>
  )
}

export interface ButtonProps {
  label?: string
  color?: 'success' | 'warning' | 'error' | 'info' | 'OKFNCoolGray'
  active?: boolean
  enabled?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface ErrorsReportProps extends ButtonProps {
  numberErrors?: number
}

export function MetadataButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop
  useKeyPress(['alt.m'], (event) => {
    event.preventDefault()
    if (!props.enabled && !props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Metadata'}
          Icon={TuneIcon}
          color={props.color || 'OKFNCoolGray'}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.OKFNCoolGray.main : undefined,
            },
          }}
        />
      </Box>
  )
}

export function ReportButton(props: ErrorsReportProps ) {
  const theme = useTheme()
  const onClick = props.onClick || noop
  useKeyPress(['alt.r'], (event) => {
    event.preventDefault()
    if (!props.enabled && !props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Errors Report'}
          Icon={RuleIcon}
          color={props.color || props.active ? 'OKFNCoolGray' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.info.main : undefined,
            },
          }}
          extraInfo={props.numberErrors}
        />
      </Box>
  )
}

export function SourceButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop
  useKeyPress(['alt.s'], (event) => {
    event.preventDefault()
    if (!props.enabled && !props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Source'}
          Icon={CodeIcon}
          color={props.color || props.active ? 'OKFNCoolGray' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.OKFNCoolGray.main : undefined,
            },
          }}
        />
      </Box>
  )
}

export function ChatButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.m'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Chat AI'}
          Icon={SupportAgentIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
  )
}

export function UndoButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.z'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Undo'}
          Icon={UndoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
          }}
        />
      </Box>
  )
}

export function RedoButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.y'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Redo'}
          Icon={RedoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            }
          }}
        />
      </Box>
  )
}

export function ClearButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.p'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Clear'}
          Icon={FormatClearIcon}
          color={props.color || 'OKFNCoolGray'}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            }
          }}
        />
      </Box>
  )
}

export function FixButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.i'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Fix'}
          Icon={HandymanIcon}
          color={props.color || 'OKFNCoolGray'}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            }
          }}
        />
      </Box>
  )
}

export function MinifyButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.y'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Minify'}
          Icon={CompressIcon}
          color={props.color || 'OKFNCoolGray'}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            }
          }}
        />
      </Box>
  )
}

export function PrettifyButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.b'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Prettify'}
          Icon={DataObjectIcon}
          color={props.color || 'OKFNCoolGray'}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            }
          }}
        />
      </Box>
  )
}
