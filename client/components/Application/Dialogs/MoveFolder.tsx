import CopyAllIcon from '@mui/icons-material/CopyAll'
import InputDialog from '../../Parts/Dialogs/Input'
import * as store from '@client/store'

export default function MoveFolderDialog() {
  const path = store.useStore((state) => state.path)
  if (!path) return null

  return (
    <InputDialog
      open={true}
      value={path}
      title="Move Folder"
      label="Move"
      Icon={CopyAllIcon}
      placholder="Enter a path"
      description={`You are moving "${path}". Enter destination:`}
      onCancel={store.closeDialog}
      onConfirm={async (toPath) => {
        await store.moveFolder(path, toPath)
        store.closeDialog()
      }}
    />
  )
}
