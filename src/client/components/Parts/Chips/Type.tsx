import * as React from 'react'
import Chip from '@mui/material/Chip'
// import InputIcon from '@mui/icons-material/Input'
import DisplaySettingsIcon from '@mui/icons-material/DisplaySettings'
import LightTooltip from '../Tooltips/Light'
import * as settings from '../../../settings'

// TODO: create BaseChip / move concrete to appliction?

export interface TypeChipProps {
  type?: string
  onClick?: () => void
}

export default function TypeChip(props: TypeChipProps) {
  const label = props.type || 'project'
  const title = props.type ? 'Adjust file name and type' : 'Open project config dialog'
  const Icon = props.type
    ? settings.TYPE_ICONS[props.type] || settings.TYPE_ICONS.file
    : DisplaySettingsIcon
  return (
    <LightTooltip title={title}>
      <Chip
        onClick={props.onClick}
        icon={<Icon />}
        label={label.toUpperCase()}
        color="primary"
        size="medium"
        sx={{
          width: '8vw',
          height: '100%',
          borderRight: 'solid 1px #ddd',
          borderRadius: '3px',
          cursor: 'pointer',
        }}
      />
    </LightTooltip>
  )
}
