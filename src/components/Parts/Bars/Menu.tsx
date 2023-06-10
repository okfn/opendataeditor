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

// TODO: don't use hard-coded color (info=#9c27b0)
// TODO: add spacing between buttons

export type MenuBarItem =
  | 'editor'
  | 'metadata'
  | 'report'
  | 'source'
  | 'errors'
  | 'clear'
  | 'undo'
  | 'redo'
  | 'fix'
  | 'minify'
  | 'prettify'

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
  disabled?: boolean
  onClick?: () => void
}

export function EditorButton(props: ButtonProps) {
  return (
    <LightTooltip title={props.onClick ? 'Toggle the editor panel' : 'Editor is enabled'}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Editor'}
          Icon={EditRoadIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
          sx={{
            '&.Mui-disabled': {
              color: props.color ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

export function MetadataButton(props: ButtonProps) {
  return (
    <LightTooltip
      title={props.onClick ? 'Toggle the metadata panel' : 'Metadata is enabled'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Metadata'}
          Icon={TuneIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
          sx={{
            '&.Mui-disabled': {
              color: props.color ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

export function ReportButton(props: ButtonProps) {
  return (
    <LightTooltip
      title={props.onClick ? 'Toggle the report panel' : 'Report is not available'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Report'}
          Icon={RuleIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
          sx={{
            '&.Mui-disabled': {
              color: props.color ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

export function SourceButton(props: ButtonProps) {
  return (
    <LightTooltip title={props.onClick ? 'Toggle the source panel' : 'Source is enabled'}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || 'Source'}
          Icon={CodeIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
          sx={{
            '&.Mui-disabled': {
              color: props.color ? '#9c27b0' : undefined,
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
          color={props.color}
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
