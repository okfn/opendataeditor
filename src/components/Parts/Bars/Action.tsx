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
  updated?: boolean
  disabled?: boolean
  onClick?: () => void
}

export function SaveAsButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Save to another location [Ctrl+D]'
  if (props.disabled) title = 'Saving to another locaion is not avialble'
  useKeyPress(['ctrl.d'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Save As'}
          Icon={SaveAltIcon}
          variant="outlined"
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{ backgroundColor: 'white' }}
        />
      </Box>
    </LightTooltip>
  )
}

export function PublishButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Publish on the web [Ctrl+U]'
  if (props.disabled) title = 'Publishing on the web is not avialble'
  useKeyPress(['ctrl.u'], (event) => {
    event.preventDefault()
    if (!props.disabled) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Publish'}
          Icon={IosShareIcon}
          variant="outlined"
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{ backgroundColor: 'white' }}
        />
      </Box>
    </LightTooltip>
  )
}

export function RevertButton(props: ButtonProps) {
  const onClick = props.onClick || noop
  let title = 'Revert the changes [Ctrl+R]'
  if (!props.updated) title = 'No changes to revert'
  useKeyPress(['ctrl.r'], (event) => {
    event.preventDefault()
    if (props.updated) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Revert'}
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
  const onClick = props.onClick || noop
  let title = 'Save the changes [Ctrl+S]'
  if (!props.updated) title = 'No changes to save'
  useKeyPress(['ctrl.s'], (event) => {
    event.preventDefault()
    if (props.updated) {
      onClick()
    }
  })
  return (
    <LightTooltip title={title}>
      <Box>
        <IconButton
          label={props.label || 'Save'}
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
