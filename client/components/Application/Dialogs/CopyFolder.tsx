import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import InputDialog from '../../Parts/Dialogs/Input'
import { useStore } from '../store'

export default function CopyFolderDialog() {
  const paths = useStore((state) => state.paths)
  const copyFolder = useStore((state) => state.copyFolder)
  const updateState = useStore((state) => state.updateState)
  if (!paths || paths.length > 1) return null
  return (
    <InputDialog
      open={true}
      value={paths[0]}
      title="Copy Folder"
      label="Copy"
      Icon={ContentCopyIcon}
      placholder="Enter a path"
      description={`You are copying "${paths[0]}". Enter destination:`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async (toPath) => {
        await copyFolder(paths[0], toPath)
        updateState({ dialog: undefined })
      }}
    />
  )
}
