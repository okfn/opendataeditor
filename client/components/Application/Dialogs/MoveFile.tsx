import CopyAllIcon from '@mui/icons-material/CopyAll'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function MoveFileDialog() {
  const path = useStore((state) => state.path)
  const moveFile = useStore((state) => state.moveFile)
  const updateState = useStore((state) => state.updateState)
  if (!path) return null
  return (
    <InputDialog
      open={true}
      value={path}
      title="Move File"
      label="Move"
      Icon={CopyAllIcon}
      placholder="Enter a path"
      description={`You are moving "${path}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await moveFile(path, toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
