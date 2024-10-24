import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function RenameFileDialog() {
  const currentFilePath = store.useStore((state) => state.path)

  return (
    <InputDialog
      open={true}
      value={currentFilePath}
      title="Rename File"
      label="Save"
      placholder="Name of new file"
      onCancel={store.closeDialog}
      onConfirm={async (newPath) => {
        if (currentFilePath) await store.moveFile(currentFilePath, newPath)
        store.closeDialog()
      }}
    />
  )
}
