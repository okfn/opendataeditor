import * as React from 'react'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import TextField from '@mui/material/TextField'
import { useStore } from '../store'
import Columns from '../../../Parts/Columns'
import * as settings from '../../../../settings'
import ExportIcon from '@mui/icons-material/IosShare'
import Cancel from '@mui/icons-material/Cancel'
import ButtonContent from '../../../Parts/ButtonContent'

export default function SaveAsDialog() {
  const [name, setName] = React.useState('')
  const [format, setFormat] = React.useState('csv')
  const dialog = useStore((state) => state.dialog)
  const updateState = useStore((state) => state.updateState)
  const exportTable = useStore((state) => state.exportTable)
  const onExport = useStore((state) => state.onExport)
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) =>
    setName(ev.target.value)
  const handleCancel = () => updateState({ dialog: undefined })
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
      open={dialog === 'saveAs'}
      onClose={handleCancel}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      <DialogTitle id="dialog-title">Save As</DialogTitle>
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
            <ButtonContent label={'Cancel'} icon={Cancel} />
          </Button>
          <Button
            fullWidth
            sx={{ my: 0.5 }}
            onClick={handleExport}
            aria-label="export"
            variant="contained"
            disabled={!name}
          >
            <ButtonContent label={'Save'} icon={ExportIcon} />
          </Button>
        </Columns>
      </Box>
    </Dialog>
  )
}
