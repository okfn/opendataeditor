import * as React from 'react'
import TerminalIcon from '@mui/icons-material/Terminal'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore, selectors } from '../store'

export default function CreateScriptDialog() {
  const folderPath = useStore(selectors.folderPath)
  const createScript = useStore((state) => state.createScript)
  const updateState = useStore((state) => state.updateState)
  const path = folderPath ? `${folderPath}/script.py` : 'script.py'
  return (
    <InputDialog
      open={true}
      value={path}
      title="Create Script"
      label="Create"
      description="You are creating a Python script. Enter destination:"
      placholder="Enter a script path"
      Icon={TerminalIcon}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (path) => {
        await createScript(path)
        updateState({ dialog: undefined })
      }}
    />
  )
}
