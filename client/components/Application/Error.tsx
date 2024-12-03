import * as store from '@client/store'
import { Box } from '@mui/material'
import NoButtonDialog from '../Parts/Dialogs/NoButton'

export default function Error() {
  const error = store.useStore((state) => state.error)
  if (!error) return null

  return (
    <NoButtonDialog open={true} maxWidth="md" title="Error" onClose={store.closeError}>
      <Box sx={{ color: 'red' }}>{error.detail}</Box>
    </NoButtonDialog>
  )
}
