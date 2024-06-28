import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import * as store from '@client/store'

export default function DeleteFolderDialog() {
  const path = store.useStore((state) => state.path)
  if (!path) return null

  return (
    <ConfirmDialog
      open={true}
      title="Delete Folder"
      description="Are you sure you want to delete this folder?"
      label="Yes"
      cancelLabel="No"
      onCancel={store.closeDialog}
      onConfirm={async () => {
        await store.deleteFolder(path)
        store.closeDialog()
      }}
    />
  )
}
