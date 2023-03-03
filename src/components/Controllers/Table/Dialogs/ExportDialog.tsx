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
import FileSaver from 'file-saver'
import * as settings from '../../../../settings'
import ExportIcon from '@mui/icons-material/IosShare'
import { Close, Download } from '@mui/icons-material'

export default function NameDialog() {
  const [name, setName] = React.useState('')
  const [format, setFormat] = React.useState('csv')
  const dialog = useStore((state) => state.dialog)
  const setDialog = useStore((state) => state.setDialog)
  const exportTable = useStore((state) => state.exportTable)
  const downloadTable = useStore((state) => state.downloadTable)
  const onExport = useStore((state) => state.onExport)
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setName(ev.target.value)
  const handleCancel = () => setDialog(undefined)
  const handleDownload = async () => {
    const { bytes, path } = await downloadTable(name, format)
    if (bytes) {
      const blob = new Blob([bytes])
      const filename = path?.split('/').slice(-1).join()
      FileSaver.saveAs(blob, filename)
    }

    handleCancel()
  }
  const handleExport = async () => {
    console.log(name, format)
    const path = await exportTable(name, format)
    onExport(path)
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
                if (event.key === 'Enter') handleExport()
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
              {settings.FORMATS.map((option, index) => (
                <MenuItem value={option} key={index}>
                  {option.toUpperCase()}
                </MenuItem>
              ))}
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
            <Close fontSize="small" sx={{ mr: 1 }} /> Cancel
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleExport}
            aria-label="export"
            color="secondary"
            variant="contained"
            disabled={!name}
          >
            <ExportIcon fontSize="small" sx={{ mr: 1 }} /> Export
          </Button>
        </Columns>
      </Box>
      <Divider variant="middle" sx={{ mx: '0px', borderStyle: 'dashed' }} />
      <Box sx={{ paddingX: 3, paddingY: 1 }}>
        <Columns spacing={2}>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleDownload}
            aria-label="download"
            color="secondary"
            variant="contained"
            disabled={!name}
          >
            <Download fontSize="small" sx={{ mr: 1 }} /> Download
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
