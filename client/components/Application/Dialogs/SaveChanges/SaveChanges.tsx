import NoButtonDialog from '@client/components/Parts/Dialogs/NoButton'
import Box from '@mui/material/Box'
import LinearProgress from '@mui/material/LinearProgress'
import Stack from '@mui/material/Stack'
import { startCase } from 'lodash'
import * as store from './SaveChanges.store'

export function SaveChangesDialog() {
  return (
    <NoButtonDialog
      open={true}
      maxWidth="md"
      title="Saving Changes"
      onClose={store.closeDialog}
    >
      <ProgressIndicator />
    </NoButtonDialog>
  )
}

// TODO: move to common components
function ProgressIndicator() {
  const { progress } = store.useState()

  if (!progress) {
    return null
  }

  if (progress.type === 'error') {
    return <Box sx={{ color: 'red' }}>{progress.message}</Box>
  }

  return (
    <Stack spacing={1}>
      <Box>{progress.title || startCase(progress.type)}...</Box>
      <LinearProgress
        sx={{
          '& .MuiLinearProgress-bar': {
            backgroundColor: '#00D1FF',
          },
          padding: '10px',
        }}
      />
      <Box sx={{ color: 'gray' }}>{progress.message}</Box>
    </Stack>
  )
}
