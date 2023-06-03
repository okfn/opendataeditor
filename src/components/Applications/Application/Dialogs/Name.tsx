import * as React from 'react'
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder'
import InputDialog from '../../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function NameDialog() {
  const folderPath = useStore(selectors.folderPath)
  const dialog = useStore((state) => state.dialog)
  const createFolder = useStore((state) => state.createFolder)
  const updateState = useStore((state) => state.updateState)
  return (
    <InputDialog
      value={folderPath}
      title="Create Folder"
      label="Create"
      Icon={CreateNewFolderIcon}
      open={!!dialog && dialog.startsWith('name/')}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createFolder(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
