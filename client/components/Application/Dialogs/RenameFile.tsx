import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function RenameFileDialog() {
  const currentFilePath = store.useStore((state) => state.path)
  const isFolder = store.useStore(store.getIsFolder)

  return (
    <InputDialog
      open={true}
      value=""
      title="Rename File"
      label="Save"
      placholder={`Name of new ${isFolder ? 'folder' : 'file'}`}
      onCancel={store.closeDialog}
      onConfirm={async (newPath) => {
        if (currentFilePath)
          if (!isFolder) {
            await store.moveFile(currentFilePath, newPath)
          } else {
            await store.moveFolder(currentFilePath, newPath)
          }
        store.closeDialog()
      }}
    />
  )
}
