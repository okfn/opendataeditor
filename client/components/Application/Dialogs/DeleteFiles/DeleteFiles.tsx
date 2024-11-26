import TwoButtonDialog from '@client/components/Parts/Dialogs/TwoButton'
import * as store from '@client/store'

export function DeleteFilesDialog() {
  const path = store.useStore((state) => state.path)
  const isFolder = store.useStore(store.getIsFolder)

  if (!path) return null

  const description = `Are you sure you want to delete this ${
    isFolder ? 'folder' : 'file'
  }?`

  return (
    <TwoButtonDialog
      open={true}
      title="Delete File"
      description={description}
      label="Delete"
      hoverBgButtonColor="OKFNRed600"
      cancelLabel="No"
      onCancel={store.closeDialog}
      onConfirm={async () => {
        if (isFolder) {
          await store.deleteFolders([path])
        } else {
          await store.deleteFiles([path])
        }
        store.closeDialog()
      }}
    />
  )
}
