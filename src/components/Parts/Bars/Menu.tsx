import * as React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import RuleIcon from '@mui/icons-material/Rule'
import CompressIcon from '@mui/icons-material/Compress'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HandymanIcon from '@mui/icons-material/Handyman'
import CodeIcon from '@mui/icons-material/Code'
import TuneIcon from '@mui/icons-material/Tune'
import EditRoadIcon from '@mui/icons-material/EditRoad'
import LightTooltip from '../Tooltips/Light'
import IconButton from '../Buttons/Icon'
import { useTheme } from '@mui/material/styles'

// TODO: add spacing between buttons

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
  if (!props.fullWidth) return <React.Fragment>{props.children}</React.Fragment>
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

export function EditorButton(props: ButtonProps) {
  const theme = useTheme()
  let title = 'Toggle the editor panel'
  if (props.enabled) title = 'Editor is enabled'
  if (props.disabled) title = 'Editor is not available'
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Editor'}
          Icon={EditRoadIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
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

export function MetadataButton(props: ButtonProps) {
  const theme = useTheme()
  let title = 'Toggle the metadta panel'
  if (props.enabled) title = 'Metadata is enabled'
  if (props.disabled) title = 'Metadata is not available'
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
          onClick={() => (props.onClick ? props.onClick() : undefined)}
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
  let title = 'Toggle the report panel'
  if (props.enabled) title = 'Report is enabled'
  if (props.disabled) title = 'Report is not available'
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
          onClick={() => (props.onClick ? props.onClick() : undefined)}
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
  let title = 'Toggle the source panel'
  if (props.enabled) title = 'Source is enabled'
  if (props.disabled) title = 'Source is not available'
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
          onClick={() => (props.onClick ? props.onClick() : undefined)}
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

export function ErrorsButton(props: ButtonProps) {
  return (
    <LightTooltip
      title={props.onClick ? 'Toggle showing only errors' : 'No errors to show'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Errors'}
          Icon={ReportGmailerrorredIcon}
          color={props.color || props.active ? 'warning' : undefined}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}

export function ClearButton(props: ButtonProps) {
  return (
    <LightTooltip title="Clear the contents">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Clear'}
          Icon={FormatClearIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}

export function UndoButton(props: ButtonProps) {
  return (
    <LightTooltip title={props.onClick ? 'Undo last change' : 'Nothing to undo'}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Undo'}
          Icon={UndoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}

export function RedoButton(props: ButtonProps) {
  return (
    <LightTooltip title={props.onClick ? 'Redo last change' : 'Nothing to redo'}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Redo'}
          Icon={RedoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}

export function FixButton(props: ButtonProps) {
  return (
    <LightTooltip title="Fix formatting">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Fix'}
          Icon={HandymanIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}

export function MinifyButton(props: ButtonProps) {
  return (
    <LightTooltip title="Minify formatting">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Minify'}
          Icon={CompressIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}

export function PrettifyButton(props: ButtonProps) {
  return (
    <LightTooltip title="Prettify formatting">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Prettify'}
          Icon={DataObjectIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
        />
      </Box>
    </LightTooltip>
  )
}
