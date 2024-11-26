import InputDialog from '@client/components/Parts/Dialogs/Input'
import { LinearProgress } from '@client/components/Parts/Progress/Linear'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'

export function CreateFolderDialog() {
  const folderPath = appStore.useStore(appStore.getFolderPath)
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  return (
    <InputDialog
      open={true}
      value={folderPath}
      title="Create new folder"
      label="Create"
      placholder="Name of the new folder"
      onCancel={store.closeDialog}
      onConfirm={store.createFolder}
    >
      <LinearProgress progress={progress} />
    </InputDialog>
  )
}
