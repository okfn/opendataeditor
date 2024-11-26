import NoButtonDialog from '@client/components/Parts/Dialogs/NoButton'
import { LinearProgress } from '@client/components/Parts/Progress/Linear'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'

export function SaveChangesDialog() {
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

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
