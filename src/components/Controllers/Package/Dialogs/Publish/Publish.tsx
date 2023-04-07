import * as React from 'react'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import LinearProgress from '@mui/material/LinearProgress'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import CancelIcon from '@mui/icons-material/Cancel'
import CheckIcon from '@mui/icons-material/Check'
import VerticalTabs from '../../../../Parts/Tabs/Vertical'
import IconButton from '../../../../Parts/Buttons/IconButton'
import Columns from '../../../../Parts/Columns'
import CkanSection from './Ckan'
import { useStore, selectors } from '../../store'

export default function Publish() {
  const dialog = useStore((state) => state.dialog)
  const publish = useStore((state) => state.publish)
  const control = useStore(selectors.control)
  const isPublishing = useStore((state) => state.isPublishing)
  const updateState = useStore((state) => state.updateState)
  const handleCancel = () => updateState({ dialog: undefined })
  const handlePublish = () => publish()
  return (
    <Dialog open={dialog === 'publish'}>
      <DialogTitle sx={{ borderBottom: 'solid 1px #ddd', backgroundColor: '#fafafa' }}>
        Publish Dataset
      </DialogTitle>
      <DialogContent>
        <VerticalTabs
          labels={['CKAN', 'Github', 'Zenodo']}
          disabledLabels={['Github', 'Zenodo']}
        >
          <CkanSection />
          <Box>github</Box>
          <Box>zenodo</Box>
        </VerticalTabs>
        <Box>
          {isPublishing && (
            <Box>
              Publishing
              <LinearProgress />
            </Box>
          )}
        </Box>
      </DialogContent>
      <Box sx={{ padding: 2, borderTop: 'solid 1px #ddd', backgroundColor: '#fafafa' }}>
        <Columns spacing={2}>
          <IconButton
            label="Cancel"
            onClick={handleCancel}
            variant="contained"
            color="warning"
            Icon={CancelIcon}
          />
          <IconButton
            disabled={!control}
            label="Publish"
            onClick={handlePublish}
            variant="contained"
            Icon={CheckIcon}
          />
        </Columns>
      </Box>
    </Dialog>
  )
}
