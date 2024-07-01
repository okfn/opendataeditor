import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function CopyFileDialog() {
  const path = store.useStore((state) => state.path)
  if (!path) return null

  return (
    <InputDialog
      open={true}
      value={path}
      title="Copy File"
      label="Copy"
      Icon={ContentCopyIcon}
      placholder="Enter a path"
      description={`You are copying "${path}". Enter destination:`}
      onCancel={store.closeDialog}
      onConfirm={async (toPath) => {
        await store.copyFile(path, toPath)
        store.closeDialog()
      }}
    />
  )
}
