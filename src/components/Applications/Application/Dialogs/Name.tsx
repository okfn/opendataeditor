import * as React from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function NameDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createFolder = useStore((state) => state.createFolder)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      open={true}
      value={folderPath}
      title="Create Folder"
      label="Create"
      description="You are creating a folder. Enter destination:"
      placholder="Enter a folder path"
      Icon={CreateNewFolderIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createFolder(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
