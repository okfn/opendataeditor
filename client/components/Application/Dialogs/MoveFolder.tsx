import CopyAllIcon from '@mui/icons-material/CopyAll'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function MoveFolderDialog() {
  const paths = useStore((state) => state.paths)
  const moveFolder = useStore((state) => state.moveFolder)
  const updateState = useStore((state) => state.updateState)
  if (!paths || paths.length > 1) return null
  return (
    <InputDialog
      open={true}
      value={paths[0]}
      title="Move Folder"
      label="Move"
      Icon={CopyAllIcon}
      placholder="Enter a path"
      description={`You are moving "${paths[0]}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await moveFolder(paths[0], toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
