import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import LinearSensor from '../../Parts/Sensors/Linear'
import * as store from '@client/store'
import { client } from '@client/client'

export default function IndexFilesDialog() {
  const [progress, setProgress] = React.useState(0)
  const notIndexedFiles = store.useStore(store.getNotIndexedFiles)

  return (
    <ConfirmDialog
      open={true}
      title="Index Files"
      label="Index"
      Icon={DeleteIcon}
      disabled={!!progress}
      description={`Index not indexed files (${notIndexedFiles.length}). It might take some time`}
      onCancel={store.closeDialog}
      onConfirm={async () => {
        for (const [index, file] of notIndexedFiles.entries()) {
          await client.fileIndex({ path: file.path })
          setProgress((100 * (index + 1)) / notIndexedFiles.length)
        }
        await store.loadFiles()
        store.closeDialog()
      }}
    >
      {progress > 0 && progress < 100 && <LinearSensor value={progress} labeled />}
    </ConfirmDialog>
  )
}
