import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import IosShareIcon from '@mui/icons-material/IosShare'
import SaveAltIcon from '@mui/icons-material/SaveAlt'
import CheckIcon from '@mui/icons-material/Check'
import HistoryIcon from '@mui/icons-material/History'
import IconButton from '../../Parts/Buttons/Icon'
import Columns from '../../Parts/Columns'
import LightTooltip from '../Tooltips/Light'
import { useKeyPress } from 'ahooks'

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
  disabled?: boolean
  updated?: boolean
  onClick?: () => void
}

export function SaveAsButton(props: ButtonProps) {
  let title = 'Save to another location'
  if (props.disabled) title = 'Saving to another locaion is not avialble'
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Save As'}
          Icon={SaveAltIcon}
          variant="outlined"
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
          sx={{ backgroundColor: 'white' }}
        />
      </Box>
    </LightTooltip>
  )
}

export function PublishButton(props: ButtonProps) {
  let title = 'Publish on the web'
  if (props.disabled) title = 'Publishing on the web is not avialble'
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Publish'}
          Icon={IosShareIcon}
          variant="outlined"
          disabled={props.disabled}
          onClick={() => (props.onClick ? props.onClick() : undefined)}
          sx={{ backgroundColor: 'white' }}
        />
      </Box>
    </LightTooltip>
  )
}

export function RevertButton(props: ButtonProps) {
  let title = 'Revert the changes'
  if (!props.updated) title = 'No changes to revert'
  let label = props.label || 'Revert'
  if (props.updated) label = `${label} [Ctrl+R]`
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.r'], (event) => {
    if (props.updated) {
      event.preventDefault()
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={label}
          Icon={HistoryIcon}
          color={props.updated ? 'warning' : undefined}
          variant={props.updated ? 'contained' : 'outlined'}
          disabled={!props.updated}
          onClick={() => onClick()}
          sx={{ backgroundColor: !props.updated ? 'white' : undefined }}
        />
      </Box>
    </LightTooltip>
  )
}

export function SaveButton(props: ButtonProps) {
  let title = 'Save the changes'
  if (!props.updated) title = 'No changes to save'
  let label = props.label || 'Save'
  if (props.updated) label = `${label} [Ctrl+S]`
  const onClick = props.onClick || noop
  useKeyPress(['ctrl.s'], (event) => {
    if (props.updated) {
      event.preventDefault()
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={label}
          Icon={CheckIcon}
          variant={props.updated ? 'contained' : 'outlined'}
          disabled={!props.updated}
          onClick={() => onClick()}
          sx={{ backgroundColor: !props.updated ? 'white' : undefined }}
        />
      </Box>
    </LightTooltip>
  )
}
