import CopyAllIcon from '@mui/icons-material/CopyAll'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function MoveFileDialog() {
  const paths = useStore((state) => state.paths)
  const moveFile = useStore((state) => state.moveFile)
  const updateState = useStore((state) => state.updateState)
  if (!paths || paths.length > 1) return null
  return (
    <InputDialog
      open={true}
      value={paths[0]}
      title="Move File"
      label="Move"
      Icon={CopyAllIcon}
      placholder="Enter a path"
      description={`You are moving "${paths[0]}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await moveFile(paths[0], toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
