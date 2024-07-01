import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function CopyFolderDialog() {
  const path = store.useStore((state) => state.path)
  if (!path) return null

  return (
    <InputDialog
      open={true}
      value={path}
      title="Copy Folder"
      label="Copy"
      Icon={ContentCopyIcon}
      placholder="Enter a path"
      description={`You are copying "${path}". Enter destination:`}
      onCancel={store.closeDialog}
      onConfirm={async (toPath) => {
        await store.copyFolder(path, toPath)
        store.closeDialog()
      }}
    />
  )
}
