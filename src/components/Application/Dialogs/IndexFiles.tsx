import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import LinearSensor from '../../Parts/Sensors/Linear'
import { useStore, selectors } from '../store'

export default function IndexFilesDialog() {
  const [progress, setProgress] = React.useState(0)
  const client = useStore((state) => state.client)
  const loadFiles = useStore((state) => state.loadFiles)
  const updateState = useStore((state) => state.updateState)
  const notIndexedFiles = useStore(selectors.notIndexedFiles)
  return (
    <ConfirmDialog
      open={true}
      title="Index Files"
      label="Index"
      Icon={DeleteIcon}
      disabled={!!progress}
      description={`Index not indexed files (${notIndexedFiles.length}). It might take some time`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        for (const [index, file] of notIndexedFiles.entries()) {
          await client.fileIndex({ path: file.path })
          setProgress((100 * (index + 1)) / notIndexedFiles.length)
        }
        updateState({ dialog: undefined })
        await loadFiles()
      }}
    >
      {progress > 0 && progress < 100 && <LinearSensor value={progress} labeled />}
    </ConfirmDialog>
  )
}
