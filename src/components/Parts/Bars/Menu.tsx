import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import CompressIcon from '@mui/icons-material/Compress'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred'
import HandymanIcon from '@mui/icons-material/Handyman'
import CodeIcon from '@mui/icons-material/Code'
import TuneIcon from '@mui/icons-material/Tune'
import IconButton from '../../Parts/Buttons/IconButton'

export type MenuBarItem =
  | 'clear'
  | 'fix'
  | 'minify'
  | 'prettify'
  | 'metadata'
  | 'preview'
  | 'source'
  | 'errors'

export interface MenuBarProps {
  items: MenuBarItem[]
  labels?: { [key in MenuBarItem]?: 'string' | undefined }
  colors?: { [key in MenuBarItem]?: 'success' | 'warning' | 'error' | undefined }
  onClear?: () => void
  onFix?: () => void
  onMinify?: () => void
  onPrettify?: () => void
  onMetadata?: () => void
  onPreview?: () => void
  onSource?: () => void
  onErrors?: () => void
}

// TODO: add spacing between buttons
// TODO: use React.useMemo for better performance/animation
export default function MenuBar(props: React.PropsWithChildren<MenuBarProps>) {
  const Clear = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.clear || 'Clear'}
        Icon={FormatClearIcon}
        color={props.colors?.clear || 'info'}
        disabled={!props.onClear}
        onClick={props.onClear}
      />
    )
  }

  const Fix = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.fix || 'Fix'}
        Icon={HandymanIcon}
        color={props.colors?.fix || 'info'}
        disabled={!props.onFix}
        onClick={props.onFix}
      />
    )
  }

  const Minify = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.minify || 'Minify'}
        Icon={CompressIcon}
        color={props.colors?.minify || 'info'}
        disabled={!props.onMinify}
        onClick={props.onMinify}
      />
    )
  }

  const Prettify = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.prettify || 'Prettify'}
        Icon={DataObjectIcon}
        color={props.colors?.prettify || 'info'}
        disabled={!props.onPrettify}
        onClick={props.onPrettify}
      />
    )
  }

  const Metadata = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.metadata || 'Metadata'}
        Icon={TuneIcon}
        color={props.colors?.metadata || 'info'}
        disabled={!props.onMetadata}
        onClick={props.onMetadata}
      />
    )
  }

  const Preview = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.preview || 'Preview'}
        Icon={CodeIcon}
        color={props.colors?.preview || 'info'}
        disabled={!props.onPreview}
        onClick={props.onPreview}
      />
    )
  }

  const Source = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.source || 'Source'}
        Icon={CodeIcon}
        color={props.colors?.source || 'info'}
        disabled={!props.onSource}
        onClick={props.onSource}
      />
    )
  }

  const Errors = () => {
    return (
      <IconButton
        small
        variant="text"
        label={props.labels?.errors || 'Errors'}
        Icon={ReportGmailerrorredIcon}
        color={props.colors?.errors || 'info'}
        disabled={!props.onErrors}
        onClick={props.onErrors}
      />
    )
  }

  return (
    <Toolbar
      disableGutters
      sx={{ borderBottom: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2 }}
    >
      {props.items.includes('clear') && <Clear />}
      {props.items.includes('fix') && <Fix />}
      {props.items.includes('minify') && <Minify />}
      {props.items.includes('prettify') && <Prettify />}
      {props.items.includes('metadata') && <Metadata />}
      {props.items.includes('preview') && <Preview />}
      {props.items.includes('source') && <Source />}
      {props.items.includes('errors') && <Errors />}
      {props.children}
    </Toolbar>
  )
}
