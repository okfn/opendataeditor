import InputDialog from '../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function AddEmptyFolderDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createFolder = useStore((state) => state.createFolder)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      open={true}
      value={folderPath}
      title="Create Folder"
      label="Create"
      placholder="Name of the new folder"
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createFolder(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
