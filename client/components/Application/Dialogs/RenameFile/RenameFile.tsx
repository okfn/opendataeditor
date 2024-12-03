import InputDialog from '@client/components/Parts/Dialogs/Input'
import { LinearProgress } from '@client/components/Progress'
import * as appStore from '@client/store'
import * as React from 'react'
import * as store from './store'

export function RenameFileDialog() {
  const isFolder = appStore.useStore(appStore.getIsFolder)
  const dialog = appStore.useStore((state) => state.dialog)
  const { progress } = store.useState()

  React.useEffect(() => {
    store.resetState()
  }, [dialog])

  const title = `Rename ${isFolder ? 'folder' : 'file'}`
  const placeholder = `Name of new ${isFolder ? 'folder' : 'file'}`

  return (
    <InputDialog
      open={true}
      value=""
      title={title}
      label="Save"
      placholder={placeholder}
      onCancel={store.closeDialog}
      onConfirm={store.renameFile}
    >
      <LinearProgress progress={progress} />
    </InputDialog>
  )
}
