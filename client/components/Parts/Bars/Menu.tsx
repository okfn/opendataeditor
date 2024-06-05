import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import RuleIcon from '@mui/icons-material/Rule'
import CompressIcon from '@mui/icons-material/Compress'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HandymanIcon from '@mui/icons-material/Handyman'
import CodeIcon from '@mui/icons-material/Code'
import TuneIcon from '@mui/icons-material/Tune'
import LightTooltip from '../Tooltips/Light'
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
      sx={{ borderBottom: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2 }}
    >
      <MenuBarItems {...props} />
    </Toolbar>
  )
}

function MenuBarItems(props: React.PropsWithChildren<MenuBarProps>) {
  if (props.fullWidth) return <React.Fragment>{props.children}</React.Fragment>
  return (
    <Stack direction="row" spacing={1}>
      {props.children}
    </Stack>
  )
}

export interface ButtonProps {
  label?: string
  color?: 'success' | 'warning' | 'error' | 'info'
  active?: boolean
  enabled?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function MetadataButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop
  let title = 'Toggle the metadta panel [Alt+M]'
  if (props.enabled) title = 'Metadata is enabled'
  if (props.disabled) title = 'Metadata is not available'
  useKeyPress(['alt.m'], (event) => {
    event.preventDefault()
    if (!props.enabled && !props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Metadata'}
          Icon={TuneIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.info.main : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

export function ReportButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop
  let title = 'Toggle the report panel [Alt+R]'
  if (props.enabled) title = 'Report is enabled'
  if (props.disabled) title = 'Report is not available'
  useKeyPress(['alt.r'], (event) => {
    event.preventDefault()
    if (!props.enabled && !props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Report'}
          Icon={RuleIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.info.main : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

export function SourceButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop
  let title = 'Toggle the source panel [Alt+S]'
  if (props.enabled) title = 'Source is enabled'
  if (props.disabled) title = 'Source is not available'
  useKeyPress(['alt.s'], (event) => {
    event.preventDefault()
    if (!props.enabled && !props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Source'}
          Icon={CodeIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.info.main : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

export function ChatButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Edit with Chat AI [Ctrl+M]'
  if (props.disabled) title = 'Chatting is not available'
  useKeyPress(['ctrl.m'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
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
    </LightTooltip>
  )
}

export function ErrorsButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Toggle showing only errors [Ctrl+E]'
  if (props.disabled) title = 'No errors to show'
  useKeyPress(['ctrl.e'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Errors'}
          Icon={ReportGmailerrorredIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function RunButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Execute the script [Ctrl+R]'
  if (props.disabled) title = 'Not possible to execute'
  useKeyPress(['ctrl.r'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Run'}
          Icon={PlayArrowIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function UndoButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Undo last change [Ctrl+Z]'
  if (props.disabled) title = 'No changes to undo'
  useKeyPress(['ctrl.z'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Undo'}
          Icon={UndoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function RedoButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Redo last change [Ctrl+Y]'
  if (props.disabled) title = 'No changes to redo'
  useKeyPress(['ctrl.y'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Redo'}
          Icon={RedoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function ClearButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Clear the contents [Ctrl+P]'
  if (props.disabled) title = 'Clearing is not available'
  useKeyPress(['ctrl.p'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Clear'}
          Icon={FormatClearIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function FixButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Fix formatting [Ctrl+I]'
  if (props.disabled) title = 'Fixing is not available'
  useKeyPress(['ctrl.i'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Fix'}
          Icon={HandymanIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function MinifyButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Minify formatting [Ctrl+Y]'
  if (props.disabled) title = 'Minifying is not available'
  useKeyPress(['ctrl.y'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Minify'}
          Icon={CompressIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}

export function PrettifyButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Prettify formatting [Ctrl+B]'
  if (props.disabled) title = 'Prettifying is not available'
  useKeyPress(['ctrl.b'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Prettify'}
          Icon={DataObjectIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
    </LightTooltip>
  )
}
