import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import IconButton from '@mui/material/IconButton'
import DialogContent from '@mui/material/DialogContent'
import CloseIcon from '@mui/icons-material/Close'
import VerticalTabs from '../../../Parts/Tabs/Vertical'
import { useStore } from '../store'

export default function Publish() {
  const dialog = useStore((state) => state.dialog)
  const updateState = useStore((state) => state.updateState)
  const handleCancel = () => updateState({ dialog: undefined })
  return (
    <Dialog open={dialog === 'publish'}>
      <DialogTitle>
        Publish Your Data
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ position: 'absolute', right: 8, top: 8, color: 'grey' }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          borderStyle: 'dotted',
          borderWidth: 1,
          borderRadius: 1,
          marginX: 2,
          marginBottom: 2,
        }}
      >
        <VerticalTabs
          labels={['CKAN', 'Github', 'Zenodo']}
          disabledLabels={['Github', 'Zenodo']}
        >
          <CkanSection />
          <Box>github</Box>
          <Box>zenodo</Box>
        </VerticalTabs>
      </DialogContent>
    </Dialog>
  )
}

function CkanSection() {
  return <Box sx={{ padding: 2 }}>ckan</Box>
}
