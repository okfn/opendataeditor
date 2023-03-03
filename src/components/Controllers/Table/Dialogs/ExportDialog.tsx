import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import { useStore } from '../store'
import { Box } from '@mui/system'
import Columns from '../../../Parts/Columns'
import { Divider, Grid, MenuItem, Select } from '@mui/material'

export default function NameDialog() {
  const [name, setName] = React.useState('')
  const [format, setFormat] = React.useState('csv')
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const exportTable = useStore((state) => state.exportTable)
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setName(ev.target.value)
  const handleCancel = () => setDialog(undefined)
  const handleCreate = () => {
    exportTable(name, format)
    handleCancel()
  }
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={!!dialog && dialog.startsWith('export/')}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Export Table</DialogTitle>
      <DialogContent sx={{ py: 0 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={9}>
            <TextField
              autoFocus
              fullWidth
              size="small"
              value={name}
              onChange={handleChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') handleCreate()
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              size="small"
              value={format}
              onChange={(event) => setFormat(event.target.value)}
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="excel">EXCEL</MenuItem>
              <MenuItem value="jsonl">JSONL</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </DialogContent>
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="warning"
            variant="contained"
          >
            Cancel
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCreate}
            aria-label="accept"
            color="secondary"
            variant="contained"
            disabled={!name}
          >
            Export
          </Button>
        </Columns>
      </Box>
      <Divider variant="middle" sx={{ mx: '0px', borderStyle: 'dashed' }} />
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleCancel}
            aria-label="cancel"
            color="secondary"
            variant="contained"
          >
            Download
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
