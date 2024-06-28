import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import * as store from '@client/store'

export default function DeleteFileDialog() {
  const path = store.useStore((state) => state.path)
  if (!path) return null

  return (
    <ConfirmDialog
      open={true}
      title="Delete File"
      description={'Are you sure you want to delete this file?'}
      label="Yes"
      cancelLabel="No"
      onCancel={store.closeDialog}
      onConfirm={async () => {
        await store.deleteFile(path)
        store.closeDialog()
      }}
    />
  )
}
