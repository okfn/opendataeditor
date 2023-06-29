import * as React from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import ConfirmDialog from '../../Parts/Dialogs/Confirm'
import LinearSensor from '../../Parts/Sensors/Linear'
import { useStore, selectors } from '../store'

export default function IndexFilesDialog() {
  const updateState = useStore((state) => state.updateState)
  const notIndexedFiles = useStore(selectors.notIndexedFiles)
  return (
    <ConfirmDialog
      open={true}
      title="Index Files"
      label="Index"
      Icon={DeleteIcon}
      description={`Index not indexed files (${notIndexedFiles.length}). It might take some time`}
      onCancel={() => updateState({ dialog: undefined })}
      onConfirm={async () => {
        updateState({ dialog: undefined })
      }}
    >
      <LinearSensor value={0} labeled />
    </ConfirmDialog>
  )
}
