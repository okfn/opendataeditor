import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import LinearProgress from '@mui/material/LinearProgress'

export interface WaitDialogProps {
  open?: boolean
  title?: string
  maxWidth?: 'md' | 'xl'
  children?: React.ReactNode
}

export default function WaitDialog(props: WaitDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth={props.maxWidth}
      open={!!props.open}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle
        id="dialog-title"
        sx={{
          paddingBottom: 1,
          marginBottom: 2,
          borderBottom: 'solid 1px #ddd',
          backgroundColor: '#fafafa',
        }}
      >
        {props.title || 'Dialog'}
      </DialogTitle>
      <DialogContent sx={{ paddingTop: 0, paddingBottom: 0 }}>
        <Box sx={{ marginY: 2 }}>
          <LinearProgress color="inherit" />
        </Box>
        <Box sx={{ marginY: 2 }}>{props.children}</Box>
      </DialogContent>
    </Dialog>
  )
}
