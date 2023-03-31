import * as React from 'react'
import Toolbar from '@mui/material/Toolbar'
import CompressIcon from '@mui/icons-material/Compress'
import DataObjectIcon from '@mui/icons-material/DataObject'
import FormatClearIcon from '@mui/icons-material/FormatClear'
import HandymanIcon from '@mui/icons-material/Handyman'
import IconButton from '../../Parts/Buttons/IconButton'

interface MenuBarProps {
  labels: string[]
  selected: string[]
  onClear?: () => void
  onFix?: () => void
  onMinify?: () => void
  onPrettify?: () => void
}

export default function MenuBar(props: React.PropsWithChildren<MenuBarProps>) {
  const Clear = () => {
    return (
      <IconButton
        small
        label="Clear"
        Icon={FormatClearIcon}
        variant="text"
        color={'Clear' in props.selected ? 'warning' : 'info'}
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
        color={'Fix' in props.selected ? 'warning' : 'info'}
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
        color={'Minify' in props.selected ? 'warning' : 'info'}
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
        color={'Prettify' in props.selected ? 'warning' : 'info'}
        disabled={!props.onPrettify}
        onClick={props.onPrettify}
      />
    )
  }

  return (
    <Toolbar
      disableGutters
      sx={{ borderTop: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2 }}
    >
      {'Clear' in props.labels && <Clear />}
      {'Fix' in props.labels && <Fix />}
      {'Minify' in props.labels && <Minify />}
      {'Prettify' in props.labels && <Prettify />}
      {props.children}
    </Toolbar>
  )
}
