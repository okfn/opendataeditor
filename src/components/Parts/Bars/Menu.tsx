import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import CompressIcon from '@mui/icons-material/Compress'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import HandymanIcon from '@mui/icons-material/Handyman'
import TuneIcon from '@mui/icons-material/Tune'
import IconButton from '../../Parts/Buttons/IconButton'

export type MenuBarItem = 'clear' | 'fix' | 'minify' | 'prettify' | 'metadata'

export interface MenuBarProps {
  items: MenuBarItem[]
  selected?: MenuBarItem[]
  onClear?: () => void
  onFix?: () => void
  onMinify?: () => void
  onPrettify?: () => void
  onMetadata?: () => void
}

// TODO: use React.useMemo for better performance/animation
export default function MenuBar(props: React.PropsWithChildren<MenuBarProps>) {
  const selected = props.selected || []
  const Clear = () => {
    return (
      <IconButton
        small
        label="Clear"
        Icon={FormatClearIcon}
        variant="text"
        color={selected.includes('clear') ? 'warning' : 'info'}
        disabled={!props.onClear}
        onClick={props.onClear}
      />
    )
  }

  const Fix = () => {
    return (
      <IconButton
        small
        label="Fix"
        Icon={HandymanIcon}
        variant="text"
        color={selected.includes('fix') ? 'warning' : 'info'}
        disabled={!props.onFix}
        onClick={props.onFix}
      />
    )
  }

  const Minify = () => {
    return (
      <IconButton
        small
        label="Minify"
        Icon={CompressIcon}
        variant="text"
        color={selected.includes('minify') ? 'warning' : 'info'}
        disabled={!props.onMinify}
        onClick={props.onMinify}
      />
    )
  }

  const Prettify = () => {
    return (
      <IconButton
        small
        label="Prettify"
        Icon={DataObjectIcon}
        variant="text"
        color={selected.includes('prettify') ? 'warning' : 'info'}
        disabled={!props.onPrettify}
        onClick={props.onPrettify}
      />
    )
  }

  const Metadata = () => {
    return (
      <IconButton
        small
        label="Metadata"
        Icon={TuneIcon}
        variant="text"
        color={selected.includes('metadata') ? 'warning' : 'info'}
        disabled={!props.onMetadata}
        onClick={props.onMetadata}
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
      {props.children}
    </Toolbar>
  )
}
