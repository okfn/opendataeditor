import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function RenameFileDialog() {
  const currentFilePath = store.useStore((state) => state.path)
  const isFolder = store.useStore(store.getIsFolder)

  return (
    <InputDialog
      open={true}
      value=""
      title={`Rename ${isFolder ? 'folder' : 'file'}`}
      label="Save"
      placholder={`Name of new ${isFolder ? 'folder' : 'file'}`}
      onCancel={store.closeDialog}
      onConfirm={async (newPath) => {
        if (currentFilePath)
          if (!isFolder) {
            await store.renameFile(currentFilePath, newPath)
          } else {
            await store.renameFolder(currentFilePath, newPath)
          }
        store.closeDialog()
      }}
    />
  )
}
