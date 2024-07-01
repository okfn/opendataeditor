import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function AddEmptyFolderDialog() {
  const folderPath = store.useStore(store.getFolderPath)

  return (
    <InputDialog
      open={true}
      value={folderPath}
      title="Create Folder"
      label="Create"
      placholder="Name of the new folder"
      onCancel={store.closeDialog}
      onConfirm={async (path) => {
        await store.createFolder(path)
        store.closeDialog()
      }}
    />
  )
}
