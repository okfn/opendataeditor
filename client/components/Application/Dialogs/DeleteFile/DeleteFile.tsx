import { LinearProgress } from '@client/components/Library/LinearProgress'
import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'

export function DeleteFileDialog() {
  const isFolder = appStore.useStore(appStore.getIsFolder)
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const title = isFolder ? 'Delete Folder' : 'Delete File'
  const description = !progress
    ? `Are you sure you want to delete this ${isFolder ? 'folder' : 'file'}?`
    : undefined

  return (
    <TwoButtonDialog
      open={true}
      title={title}
      description={description}
      label="Delete"
      hoverBgButtonColor="OKFNRed600"
      cancelLabel="No"
      onCancel={store.closeDialog}
      onConfirm={store.deleteFile}
    >
      <LinearProgress progress={progress} />
    </TwoButtonDialog>
  )
}
