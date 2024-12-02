import { LinearProgress } from '@client/components/Library/LinearProgress'
import NoButtonDialog from '@client/components/Parts/Dialogs/NoButton'
import * as store from './store'

export function SaveChangesDialog() {
  const { progress } = store.useState()

  return (
    <NoButtonDialog
      open={true}
      maxWidth="md"
      title="Saving Changes"
      onClose={store.closeDialog}
    >
      <LinearProgress progress={progress} />
    </NoButtonDialog>
  )
}
