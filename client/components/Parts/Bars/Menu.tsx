import * as React from 'react'
import noop from 'lodash/noop'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Toolbar from '@mui/material/Toolbar'
import RuleIcon from '@mui/icons-material/Rule'
import SupportAgentIcon from '@mui/icons-material/SupportAgent'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import CodeIcon from '@mui/icons-material/Code'
import TuneIcon from '@mui/icons-material/Tune'
import IconButton from '../Buttons/Icon'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'

export interface MenuBarProps {
  fullWidth?: boolean
}

export function MenuBar(props: React.PropsWithChildren<MenuBarProps>) {
  return (
    <Toolbar
      disableGutters
      sx={{ borderBottom: 'solid 1px #ddd', backgroundColor: '#fafafa', paddingX: 2, width: '100%'}}
    >
      <MenuBarItems {...props} />
    </Toolbar>
  )
}

function MenuBarItems(props: React.PropsWithChildren<MenuBarProps>) {
  if (props.fullWidth) return <React.Fragment>{props.children}</React.Fragment>
  return (
    <Stack direction="row" sx={{ width: '100%' }} spacing={1}>
      {props.children}
    </Stack>
  )
}

export interface ButtonProps {
  label?: string
  color?: 'success' | 'warning' | 'error' | 'info' | 'OKFNCoolGray'
  active?: boolean
  enabled?: boolean
  disabled?: boolean
  onClick?: () => void
}

interface ErrorsReportProps extends ButtonProps {
  numberErrors?: number
}

export function MetadataButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop

  const { t } = useTranslation()

  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || t('metadata')}
          Icon={TuneIcon}
          color={props.color || 'OKFNCoolGray'}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.OKFNCoolGray.main : undefined,
            },
          }}
        />
      </Box>
  )
}

export function ReportButton(props: ErrorsReportProps ) {
  const theme = useTheme()
  const onClick = props.onClick || noop

  const { t } = useTranslation()

  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || t('errors-report')}
          Icon={RuleIcon}
          color={props.color || props.active ? 'OKFNCoolGray' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.info.main : undefined,
            },
          }}
          extraInfo={props.numberErrors}
        />
      </Box>
  )
}

export function SourceButton(props: ButtonProps) {
  const theme = useTheme()
  const onClick = props.onClick || noop

  const { t } = useTranslation()

  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || t('source')}
          Icon={CodeIcon}
          color={props.color || props.active ? 'OKFNCoolGray' : undefined}
          disabled={props.disabled || props.enabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
            '&.Mui-disabled': {
              color: props.enabled ? theme.palette.OKFNCoolGray.main : undefined,
            },
          }}
        />
      </Box>
  )
}

export function ChatButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  const { t } = useTranslation()

  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || t('chat-ai')}
          Icon={SupportAgentIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
        />
      </Box>
  )
}

export function UndoButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  const { t } = useTranslation()

  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || t('undo')}
          Icon={UndoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            },
          }}
        />
      </Box>
  )
}

export function RedoButton(props: ButtonProps) {
  const onClick = props.onClick || noop

  const { t } = useTranslation()

  return (
      <Box>
        <IconButton
          small
          variant="text"
          label={props.label || t('redo')}
          Icon={RedoIcon}
          color={props.color}
          disabled={props.disabled}
          onClick={() => onClick()}
          sx={{
            '& .MuiTypography-root': {
              fontSize: '16px',
              fontWeight: '600'
            }
          }}
        />
      </Box>
  )
}
