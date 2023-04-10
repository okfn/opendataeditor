import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import ChartController from '../../../Controllers/Chart'
import { useStore } from '../store'

// TODO: extract shared into Parts
export default function ChartDialog() {
  const file = useStore((state) => state.file)
  const client = useStore((state) => state.client)
  const dialog = useStore((state) => state.dialog)
  const updateState = useStore((state) => state.updateState)
  const handleCancel = () => updateState({ dialog: undefined })
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      open={!!dialog && dialog === 'chart'}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Quick Chart</DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <ChartController file={file} client={client} />
      </DialogContent>
    </Dialog>
  )
}
