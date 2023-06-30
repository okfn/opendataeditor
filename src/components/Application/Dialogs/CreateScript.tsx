import * as React from 'react'
import HistoryEduIcon from '@mui/icons-material/HistoryEdu'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function CreateScriptDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createFile = useStore((state) => state.createFile)
  const updateState = useStore((state) => state.updateState)
  const path = folderPath ? `${folderPath}/` : ''
  return (
    <InputDialog
      open={true}
      value={path}
      title="Create File"
      label="Create"
      description="You are creating an empty file. Enter destination:"
      placholder="Enter a file path"
      Icon={HistoryEduIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createFile(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
