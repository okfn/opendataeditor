import CloseIcon from '@mui/icons-material/Close'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import LinearProgress from '@mui/material/LinearProgress'
import * as React from 'react'
import { useTranslation } from 'react-i18next'
import SimpleButton from '../Buttons/SimpleButton'

export interface OneButtonDialogProps {
  open?: boolean
  title?: string
  description?: string
  Icon?: React.ElementType
  label?: string
  cancelLabel?: string
  loading?: boolean
  disabled?: boolean
  maxWidth?: 'md' | 'xl'
  onCancel?: () => void
  onConfirm?: () => void
  ctrlEnter?: boolean
  children?: React.ReactNode
  disableClosing?: boolean
}

export default function OneButtonDialog(props: OneButtonDialogProps) {
  const { t } = useTranslation()
  const handleCancel = () => props.onCancel && props.onCancel()
  const handleConfirm = () => props.onConfirm && props.onConfirm()

  const handleClose = () => {
    if (props.loading) return
    if (props.disableClosing) return
    handleCancel()
  }

  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth}
      open={!!props.open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      onKeyDown={(event) => {
        if ((!props.ctrlEnter || event.ctrlKey) && event.key === 'Enter') handleConfirm()
      }}
    >
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogTitle
        id="dialog-title"
        sx={{
          paddingBottom: 1,
          marginBottom: 2,
          borderBottom: 'solid 1px #ddd',
          backgroundColor: (theme) => theme.palette.OKFNGray100.main,
        }}
      >
        {props.title || 'Dialog'}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        {props.description && (
          <Box sx={{ marginBottom: 0, opacity: 0.6 }}>{props.description}</Box>
        )}
        {props.children}
        {props.loading && (
          <Box sx={{ paddingY: 1, marginY: 1 }}>
            Loading
            <LinearProgress />
          </Box>
        )}
      </DialogContent>
      <Box
        sx={{
          marginX: props.title === 'Publish Dataset' ? '48px' : 'unset',
          paddingX: 3,
          paddingY: 2,
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <SimpleButton
          fullWidth
          label={props.label || t('confirm')}
          sx={{ my: 0.5 }}
          onClick={handleConfirm}
          aria-label="accept"
          variant="contained"
          hoverBgColor="OKFNBlue"
          color={props.label === 'Delete' ? 'OKFNRed500' : 'OKFNBlack'}
          disabled={props.disabled || props.loading}
        />
      </Box>
    </Dialog>
  )
}
