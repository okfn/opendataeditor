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
// TODO: improve performance/animation (less re-renders)

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
  items?: MenuBarItem[]
  labels?: { [key in MenuBarItem]?: string | undefined }
  colors?: { [key in MenuBarItem]?: 'success' | 'warning' | 'error' | 'info' | undefined }
  onEditor?: () => void
  onMetadata?: () => void
  onReport?: () => void
  onSource?: () => void
  onErrors?: () => void
  onClear?: () => void
  onUndo?: () => void
  onRedo?: () => void
  onFix?: () => void
  onMinify?: () => void
  onPrettify?: () => void
}

export default function MenuBar(props: React.PropsWithChildren<MenuBarProps>) {
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
  if (!props.items) return <React.Fragment>{props.children}</React.Fragment>
  return (
    <Stack direction="row" spacing={1}>
      <Editor {...props} />
      <Metadata {...props} />
      <Report {...props} />
      <Source {...props} />
      <Errors {...props} />
      <Clear {...props} />
      <Undo {...props} />
      <Redo {...props} />
      <Fix {...props} />
      <Minify {...props} />
      <Prettify {...props} />
      {props.children}
    </Stack>
  )
}

function Editor(props: MenuBarProps) {
  if (!props.items?.includes('editor')) return null
  return (
    <LightTooltip
      title={props.onEditor ? 'Toggle the editor panel' : 'Editor is enabled'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.editor || 'Editor'}
          Icon={EditRoadIcon}
          color={props.colors?.editor}
          disabled={!props.onEditor}
          onClick={() => props.onEditor!()}
          sx={{
            '&.Mui-disabled': {
              color: props.colors?.editor ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

function Metadata(props: MenuBarProps) {
  if (!props.items?.includes('metadata')) return null
  return (
    <LightTooltip
      title={props.onMetadata ? 'Toggle the metadata panel' : 'Metadata is enabled'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.metadata || 'Metadata'}
          Icon={TuneIcon}
          color={props.colors?.metadata}
          disabled={!props.onMetadata}
          onClick={() => props.onMetadata!()}
          sx={{
            '&.Mui-disabled': {
              color: props.colors?.editor ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

function Report(props: MenuBarProps) {
  if (!props.items?.includes('report')) return null
  return (
    <LightTooltip
      title={props.onReport ? 'Toggle the report panel' : 'Report is not available'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.report || 'Report'}
          Icon={RuleIcon}
          color={props.colors?.report}
          disabled={!props.onReport}
          onClick={() => props.onReport!()}
          sx={{
            '&.Mui-disabled': {
              color: props.colors?.editor ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

function Source(props: MenuBarProps) {
  if (!props.items?.includes('source')) return null
  return (
    <LightTooltip
      title={props.onSource ? 'Toggle the source panel' : 'Source is enabled'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.source || 'Source'}
          Icon={CodeIcon}
          color={props.colors?.source}
          disabled={!props.onSource}
          onClick={() => props.onSource!()}
          sx={{
            '&.Mui-disabled': {
              color: props.colors?.editor ? '#9c27b0' : undefined,
            },
          }}
        />
      </Box>
    </LightTooltip>
  )
}

function Errors(props: MenuBarProps) {
  if (!props.items?.includes('errors')) return null
  return (
    <LightTooltip
      title={props.onErrors ? 'Toggle showing only errors' : 'No errors to show'}
    >
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.errors || 'Errors'}
          Icon={ReportGmailerrorredIcon}
          color={props.colors?.errors}
          disabled={!props.onErrors}
          onClick={() => props.onErrors!()}
        />
      </Box>
    </LightTooltip>
  )
}

function Clear(props: MenuBarProps) {
  if (!props.items?.includes('clear')) return null
  return (
    <LightTooltip title="Clear the contents">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.clear || 'Clear'}
          Icon={FormatClearIcon}
          color={props.colors?.clear}
          disabled={!props.onClear}
          onClick={() => props.onClear!()}
        />
      </Box>
    </LightTooltip>
  )
}

function Undo(props: MenuBarProps) {
  if (!props.items?.includes('undo')) return null
  return (
    <LightTooltip title={props.onUndo ? 'Undo last change' : 'Nothing to undo'}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.undo || 'Undo'}
          Icon={UndoIcon}
          color={props.colors?.undo}
          disabled={!props.onUndo}
          onClick={() => props.onUndo!()}
        />
      </Box>
    </LightTooltip>
  )
}

function Redo(props: MenuBarProps) {
  if (!props.items?.includes('redo')) return null
  return (
    <LightTooltip title={props.onRedo ? 'Redo last change' : 'Nothing to redo'}>
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.redo || 'Redo'}
          Icon={RedoIcon}
          color={props.colors?.redo}
          disabled={!props.onRedo}
          onClick={() => props.onRedo!()}
        />
      </Box>
    </LightTooltip>
  )
}

function Fix(props: MenuBarProps) {
  if (!props.items?.includes('fix')) return null
  return (
    <LightTooltip title="Fix formatting">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.fix || 'Fix'}
          Icon={HandymanIcon}
          color={props.colors?.fix}
          disabled={!props.onFix}
          onClick={() => props.onFix!()}
        />
      </Box>
    </LightTooltip>
  )
}

function Minify(props: MenuBarProps) {
  if (!props.items?.includes('minify')) return null
  return (
    <LightTooltip title="Minify formatting">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.minify || 'Minify'}
          Icon={CompressIcon}
          color={props.colors?.minify}
          disabled={!props.onMinify}
          onClick={() => props.onMinify!()}
        />
      </Box>
    </LightTooltip>
  )
}

function Prettify(props: MenuBarProps) {
  if (!props.items?.includes('prettify')) return null
  return (
    <LightTooltip title="Prettify formatting">
      <Box>
        <IconButton
          small
          variant="text"
          label={props.labels?.prettify || 'Prettify'}
          Icon={DataObjectIcon}
          color={props.colors?.prettify}
          disabled={!props.onPrettify}
          onClick={() => props.onPrettify!()}
        />
      </Box>
    </LightTooltip>
  )
}
